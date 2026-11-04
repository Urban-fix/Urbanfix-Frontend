export interface ZonaResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ZonaCreateDTO {
  nombre: string;
  descripcion: string;
}

export interface ZonaUpdateDTO {
  nombre?: string;
  descripcion?: string;
}
