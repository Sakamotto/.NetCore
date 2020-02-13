import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {

  private baseURL: string = 'http://localhost:5000/api/evento';
  private tokenHeader: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.tokenHeader = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL, { headers: this.tokenHeader });
  }

  getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}`);
  }

  getEventosById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  salvarEvento(evento: Evento, modo: string): Observable<Evento> {
    if (modo === 'salvar') {
      return this.http.post<Evento>(this.baseURL, evento, { headers: this.tokenHeader });
    } else {
      return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento, { headers: this.tokenHeader });
    }
  }

  delete(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.baseURL}/${id}`);
  }

  postUpload(file: File): Observable<any> {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(`${this.baseURL}/upload`, formData, { headers: this.tokenHeader });
  }

}
