
import { Product, Category, Customer, Purchase } from "./types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Alimentos",
    icon: "package"
  },
  {
    id: "2",
    name: "Bebidas",
    icon: "package"
  },
  {
    id: "3",
    name: "Limpeza",
    icon: "package"
  },
  {
    id: "4",
    name: "Higiene",
    icon: "package"
  },
  {
    id: "5",
    name: "Hortifruti",
    icon: "package"
  }
];

// Função para criar uma data de expiração aleatória (entre hoje e 2 meses no futuro)
const getRandomExpirationDate = (): string => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 60)); // Até 60 dias no futuro
  return futureDate.toISOString().split('T')[0];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Arroz Branco 5kg",
    price: 22.90,
    description: "Arroz branco tipo 1, pacote com 5kg",
    category: "1",
    stock: 20,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Arroz"
  },
  {
    id: "2",
    name: "Feijão Carioca 1kg",
    price: 7.50,
    description: "Feijão carioca tipo 1, pacote com 1kg",
    category: "1",
    stock: 30,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Feijão"
  },
  {
    id: "3",
    name: "Açúcar Cristal 5kg",
    price: 19.90,
    description: "Açúcar cristal refinado, pacote com 5kg",
    category: "1",
    stock: 15,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Açúcar"
  },
  {
    id: "4",
    name: "Café em Pó 500g",
    price: 15.90,
    description: "Café torrado e moído, pacote com 500g",
    category: "1",
    stock: 25,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Café"
  },
  {
    id: "5",
    name: "Óleo de Soja 900ml",
    price: 7.90,
    description: "Óleo de soja refinado, garrafa com 900ml",
    category: "1",
    stock: 18,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Óleo"
  },
  {
    id: "6",
    name: "Macarrão Espaguete 500g",
    price: 3.99,
    description: "Macarrão espaguete, pacote com 500g",
    category: "1",
    stock: 40,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Macarrão"
  },
  {
    id: "7",
    name: "Refrigerante Cola 2L",
    price: 9.90,
    description: "Refrigerante sabor cola, garrafa com 2 litros",
    category: "2",
    stock: 24,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Cola"
  },
  {
    id: "8",
    name: "Água Mineral 1,5L",
    price: 2.99,
    description: "Água mineral sem gás, garrafa com 1,5 litros",
    category: "2",
    stock: 48,
    expirationDate: null,
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Água"
  },
  {
    id: "9",
    name: "Suco de Laranja 1L",
    price: 8.50,
    description: "Suco de laranja natural, garrafa com 1 litro",
    category: "2",
    stock: 12,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Suco"
  },
  {
    id: "10",
    name: "Cerveja Lata 350ml",
    price: 4.50,
    description: "Cerveja pilsen, lata com 350ml",
    category: "2",
    stock: 60,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Cerveja"
  },
  {
    id: "11",
    name: "Sabão em Pó 1kg",
    price: 12.90,
    description: "Sabão em pó para roupas, pacote com 1kg",
    category: "3",
    stock: 15,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Sabão"
  },
  {
    id: "12",
    name: "Detergente Líquido 500ml",
    price: 2.99,
    description: "Detergente líquido para louças, frasco com 500ml",
    category: "3",
    stock: 30,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Detergente"
  },
  {
    id: "13",
    name: "Papel Higiênico 12 rolos",
    price: 18.90,
    description: "Papel higiênico folha dupla, pacote com 12 rolos",
    category: "4",
    stock: 20,
    expirationDate: null,
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Papel"
  },
  {
    id: "14",
    name: "Shampoo 350ml",
    price: 11.99,
    description: "Shampoo para todos os tipos de cabelo, frasco com 350ml",
    category: "4",
    stock: 18,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Shampoo"
  },
  {
    id: "15",
    name: "Banana Prata kg",
    price: 5.99,
    description: "Banana prata fresca, preço por kg",
    category: "5",
    stock: 25,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Banana"
  },
  {
    id: "16",
    name: "Maçã kg",
    price: 8.90,
    description: "Maçã vermelha fresca, preço por kg",
    category: "5",
    stock: 20,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Maçã"
  },
  {
    id: "17",
    name: "Tomate kg",
    price: 6.90,
    description: "Tomate maduro fresco, preço por kg",
    category: "5",
    stock: 15,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Tomate"
  },
  {
    id: "18",
    name: "Cebola kg",
    price: 4.99,
    description: "Cebola fresca, preço por kg",
    category: "5",
    stock: 18,
    expirationDate: getRandomExpirationDate(),
    image: "https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Cebola"
  }
];

export const customers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    address: "Rua das Flores, 123",
    accountBalance: 0,
    purchaseHistory: []
  },
  {
    id: "2",
    name: "Maria Souza",
    phone: "(11) 91234-5678",
    email: "maria.souza@email.com",
    address: "Av. Principal, 456",
    accountBalance: -150.00, // Cliente com saldo negativo (deve ao mercado)
    purchaseHistory: []
  },
  {
    id: "3",
    name: "Pedro Santos",
    phone: "(11) 99876-5432",
    address: "Rua Alameda, 789",
    accountBalance: 0,
    purchaseHistory: []
  }
];

export const purchases: Purchase[] = [
  {
    id: "1",
    date: "2023-05-01",
    items: [
      { product: products[0], quantity: 2 },
      { product: products[3], quantity: 1 }
    ],
    total: 61.70,
    paymentMethod: "cash",
    paymentStatus: "paid",
    customer: customers[0]
  },
  {
    id: "2",
    date: "2023-05-03",
    items: [
      { product: products[1], quantity: 3 },
      { product: products[6], quantity: 2 }
    ],
    total: 42.30,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    customer: customers[1]
  },
  {
    id: "3",
    date: "2023-05-05",
    items: [
      { product: products[4], quantity: 1 },
      { product: products[7], quantity: 4 }
    ],
    total: 19.86,
    paymentMethod: "account",
    paymentStatus: "pending",
    customer: customers[1]
  }
];

// Adicionar histórico de compras aos clientes
customers[0].purchaseHistory = [purchases[0]];
customers[1].purchaseHistory = [purchases[1], purchases[2]];
