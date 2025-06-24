
import { supabase } from '@/integrations/supabase/client';

export class SpeechRecognitionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;
  private onTranscriptionCallback: ((text: string) => void) | null = null;

  constructor() {}

  async startRecording(onTranscription: (text: string) => void) {
    try {
      this.onTranscriptionCallback = onTranscription;
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        await this.processAudio();
      };

      // Record in chunks for real-time processing
      this.mediaRecorder.start(3000); // 3-second chunks
      this.isRecording = true;

      // Set up periodic processing for real-time transcription
      this.setupRealTimeProcessing();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  private setupRealTimeProcessing() {
    const interval = setInterval(async () => {
      if (!this.isRecording) {
        clearInterval(interval);
        return;
      }

      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = []; // Clear processed chunks
        
        try {
          const transcription = await this.transcribeAudio(audioBlob);
          if (transcription && this.onTranscriptionCallback) {
            this.onTranscriptionCallback(transcription);
          }
        } catch (error) {
          console.error('Real-time transcription error:', error);
        }
      }
    }, 4000); // Process every 4 seconds
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.isRecording) {
        this.isRecording = false;
        
        this.mediaRecorder.onstop = async () => {
          const finalTranscription = await this.processAudio();
          resolve(finalTranscription);
        };
        
        this.mediaRecorder.stop();
        
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
      } else {
        resolve('');
      }
    });
  }

  private async processAudio(): Promise<string> {
    if (this.audioChunks.length === 0) return '';

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    return await this.transcribeAudio(audioBlob);
  }

  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });

      if (error) throw error;
      return data?.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      return '';
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}
