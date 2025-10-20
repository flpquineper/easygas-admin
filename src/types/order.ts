export interface Order {
  id: number;
  orderDate: string; 
  user: {
    name: string;
  };
  status: {
    id: number;
    statusName: string;
  };
}