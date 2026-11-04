export interface CategoriaResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CategoriaCreateDTO {
  nombre: string;
  descripcion: string;
}

export interface CategoriaUpdateDTO {
  nombre?: string;
  descripcion?: string;
}
