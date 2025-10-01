const estoqueProdutos = {
    CPUs: {
        'Intel Core i5-13400F': { disponivel: 7, preco: 1550.00 },
        'AMD Ryzen 7 7700X': { disponivel: 4, preco: 2100.00 },
        'Intel Core i9-14900K': { disponivel: 2, preco: 3950.00 }
    },

    GPUs: {
        'NVIDIA RTX 4060 8GB': { disponivel: 12, preco: 1899.00 },
        'AMD RX 7900 XT 20GB': { disponivel: 3, preco: 4200.00 },
        'NVIDIA RTX 3050 8GB': { disponivel: 0, preco: 1350.00 },
        'NVIDIA RTX 4090 24GB': { disponivel: 1, preco: 9800.00 }
    },

    RAM: {
        'Memória DDR4 16GB (2x8GB) 3200MHz': { disponivel: 18, preco: 380.00 },
        'Memória DDR5 32GB (2x16GB) 6000MHz': { disponivel: 6, preco: 850.00 },
        'Memória DDR3 8GB (2x4GB) 1600MHz': { disponivel: 10, preco: 250.00 }
    },

    Armazenamento: {
        'SSD NVMe 1TB Kingston': { disponivel: 25, preco: 420.00 },
        'SSD SATA 500GB Crucial': { disponivel: 0, preco: 280.00 },
        'HD SATA 2TB Seagate': { disponivel: 15, preco: 350.00 },
        'SSD NVMe 2TB Samsung Pro': { disponivel: 8, preco: 1100.00 }
    },

    PlacasMae: {
        'Placa Mãe B650 (AM5)': { disponivel: 5, preco: 1300.00 },
        'Placa Mãe B760 (LGA 1700)': { disponivel: 9, preco: 950.00 }
    },

    PSUs: {
        'Fonte 650W 80 Plus Bronze': { disponivel: 14, preco: 480.00 },
        'Fonte 850W 80 Plus Gold': { disponivel: 8, preco: 790.00 }
    },

    Refrigeracao: {
        'Water Cooler 240mm RGB': { disponivel: 11, preco: 520.00 },
        'Cooler Air Torre Simples': { disponivel: 22, preco: 150.00 },
        'Pasta Térmica Alta Performance': { disponivel: 30, preco: 50.00 }
    }
};

function estoqueString(estoque) {
    const estoqueFinal = [];

    Object.entries(estoque).forEach(([categoria, produtos]) => {
        estoqueFinal.push(categoria);
        Object.entries(produtos).forEach(([nome, info]) => {
            if (info.disponivel >= 1) {
                estoqueFinal.push(`(${nome} - preço: R$ ${info.preco.toFixed(2)})`);
            }
        });
    });

    return estoqueFinal.join("");
}
const estoque = estoqueString(estoqueProdutos);

export default estoque;