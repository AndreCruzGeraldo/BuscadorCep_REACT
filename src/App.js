import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './styles.css';
import api from './services/api';

function App() {

  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});

  function handleInputChange(e) {
    const value = e.target.value;
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    // Adiciona o traço se o valor tiver mais de 5 dígitos
    let formattedValue = numericValue;
    if (numericValue.length > 5) {
      formattedValue = numericValue.slice(0, 5) + '-' + numericValue.slice(5, 8);
    }
    // Limita o valor a 9 caracteres (8 dígitos + 1 traço)
    if (formattedValue.length <= 9) {
      setInput(formattedValue);
    }
  }

  async function handleSearch() {
    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(input)) {
      alert("Preencha com um CEP válido.");
      return;
    }

    try {
      const response = await api.get(`${input.replace('-', '')}/json`);
      setCep(response.data);
      setInput("");
    } catch {
      alert("Ops, erro ao buscar.");
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscador CEP</h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite seu cep..."
          value={input}
          onChange={handleInputChange}
        />

        <button className='buttonSearch' onClick={handleSearch}>
          <FiSearch size={25} color='#FFF' />
        </button>
      </div>

      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>{cep.bairro}</span>
          <span>{cep.localidade} - {cep.uf}</span>
        </main>
      )}
    </div>
  );
}

export default App;
