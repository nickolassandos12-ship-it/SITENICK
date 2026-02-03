const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos da pasta atual (HTML, CSS, JS)
app.use(express.static(__dirname));

// Configuração do MySQL - Alterado para o banco "doe"
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Coloque sua senha do MySQL aqui se houver
  database: "doe" // <--- Nome do seu banco atualizado aqui
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL (verifique se o banco 'doe' existe):", err);
    return;
  }
  console.log("Conectado ao banco de dados 'doe'!");

  // Criar tabelas se não existirem
  db.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo ENUM('doacao', 'pedido') NOT NULL,
      endereco VARCHAR(255),
      descricao TEXT,
      data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS voluntarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255),
      telefone VARCHAR(20),
      email VARCHAR(255),
      data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rota para Salvar Doação ou Pedido
app.post("/api/ajudar", (req, res) => {
  const { tipo, endereco, descricao } = req.body;
  const sql = "INSERT INTO registros (tipo, endereco, descricao) VALUES (?, ?, ?)";
  db.query(sql, [tipo, endereco, descricao], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Solicitação enviada com sucesso!" });
  });
});

// Rota para Salvar Voluntário
app.post("/api/voluntarios", (req, res) => {
  const { nome, telefone, email } = req.body;
  const sql = "INSERT INTO voluntarios (nome, telefone, email) VALUES (?, ?, ?)";
  db.query(sql, [nome, telefone, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cadastro de voluntário realizado!" });
  });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));