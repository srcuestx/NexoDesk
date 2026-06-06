import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiKey = 'TU_CLAVE_OPENROUTER'; // 👈 Pega tu clave de OpenRouter aquí
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  async getResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct', // Modelo gratuito y rápido
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente de soporte técnico de "Nexo Desk". Ayudas a resolver problemas de software, hardware, redes y tickets. Responde de forma clara y concisa.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      console.log('Respuesta de OpenRouter:', data);

      if (data.error) {
        console.error('Error de OpenRouter:', data.error);
        return `Error: ${data.error.message || 'No se pudo obtener respuesta'}`;
      }

      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error de red:', error);
      return 'Lo siento, no pude conectar con el servicio de IA. Verifica tu conexión a internet.';
    }
  }
}