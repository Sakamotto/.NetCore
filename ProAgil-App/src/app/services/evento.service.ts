import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {

  private baseURL: string = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) { }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}`);
  }

  getEventosById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  salvarEvento(evento: Evento, modo: string): Observable<Evento> {
    if (modo === 'salvar') {
      return this.http.post<Evento>(this.baseURL, evento);
    } else {
      return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento);
    }
  }

  delete(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.baseURL}/${id}`);
  }

}
