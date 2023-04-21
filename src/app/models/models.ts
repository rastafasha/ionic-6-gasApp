export interface Producto {
  name: string;
  price: number;
  reducePrice: number;
  photo: string;
  id: string;
  createAt: Date;

}

export interface Cliente {
  uid: string;
  email: string;
  name: string;
  movil: string;
  photo: string;
  referencia: string;
  ubicacion: string;
}

export interface Pedido{
  id: string;
  cliente: Cliente;
  productos: ProductoPedido [];
  precioTotal: number;
  estado: EstadoPedido;
  fecha: any;
  valoracion: number;
}

export interface ProductoPedido{
  producto: Producto;
  cantidad: number;
}

export type EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado';
