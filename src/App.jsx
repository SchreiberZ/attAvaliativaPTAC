import { useState, useEffect } from 'react'
import './App.css'

const API = 'https://jsonplaceholder.typicode.com'

function App() {
  // Estados — o que a aplicação guarda
  const [ideias, setIdeias] = useState([])
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [textoEdicao, setTextoEdicao] = useState('')

  // Carregar ideias ao abrir a página
  useEffect(() => {
    const buscarIdeias = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const resposta = await fetch(`${API}/todos?_limit=5`)
        
        if (!resposta.ok) {
          throw new Error('Não conseguiu buscar as ideias')
        }

        const dados = await resposta.json()
        setIdeias(dados)
      } catch (mensagemErro) {
        setErro('Não foi possível conectar à API. Verifique sua internet.')
      } finally {
        setCarregando(false)
      }
    }

    buscarIdeias()
  }, [])

  // Adicionar ideia nova
  const adicionarIdeia = async (e) => {
    e.preventDefault()

    if (!texto.trim()) return alert('Escreva uma ideia!')

    try {
      const resposta = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          title: texto,
          completed: false
        })
      })

      if (!resposta.ok) throw new Error('Erro ao cadastrar')

      const nova = await resposta.json()
      setIdeias([nova, ...ideias])
      setTexto('')
    } catch {
      alert('Não foi possível adicionar a ideia.')
    }
  }

  // Preparar edição
  const começarEditar = (ideia) => {
    setEditandoId(ideia.id)
    setTextoEdicao(ideia.title)
  }

  // Salvar edição
  const salvarEdicao = async (e) => {
    e.preventDefault()

    if (!textoEdicao.trim()) return alert('O título não pode ficar vazio.')

    try {
      const resposta = await fetch(`${API}/todos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          title: textoEdicao,
          completed: ideias.find(i => i.id === editandoId).completed
        })
      })

      if (!resposta.ok) throw new Error('Erro ao editar')

      setIdeias(ideias.map(ideia => {
        if (ideia.id === editandoId) {
          return { ...ideia, title: textoEdicao }
        }
        return ideia
      }))

      setEditandoId(null)
      setTextoEdicao('')
    } catch {
      alert('Não foi possível salvar as alterações.')
    }
  }

  // Marcar como feita ou não feita
  const alternarConcluida = async (ideia) => {
    const novaSituacao = !ideia.completed

    try {
      await fetch(`${API}/todos/${ideia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          title: ideia.title,
          completed: novaSituacao
        })
      })

      setIdeias(ideias.map(item => {
        if (item.id === ideia.id) {
          return { ...item, completed: novaSituacao }
        }
        return item
      }))
    } catch {
      alert('Não foi possível mudar o status.')
    }
  }

  // Excluir ideia
  const excluirIdeia = async (ideia) => {
    const listaAnterior = [...ideias]

    setIdeias(ideias.filter(item => item.id !== ideia.id))

    try {
      const resposta = await fetch(`${API}/todos/${ideia.id}`, {
        method: 'DELETE'
      })

      if (!resposta.ok) throw new Error('Falha ao excluir')
    } catch {
      setIdeias(listaAnterior)
      alert('Não foi possível excluir. Voltando...')
    }
  }

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null)
    setTextoEdicao('')
  }

  return (
    <div className="app">
      <header>
  <img 
    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cd1699c1-baaa-4632-8a2f-c609bcb3cb0e/djrsq6l-fd181420-e450-4a62-ba2a-c58dc7cbd0e0.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9jZDE2OTljMS1iYWFhLTQ2MzItOGEyZi1jNjA5YmNiM2NiMGUvZGpyc3E2bC1mZDE4MTQyMC1lNDUwLTRhNjItYmEyYS1jNThkYzdjYmQwZTAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.HedBKt1fiZ0wVcPsRkW-dT-wZHxLUEuv1_RpW1v9-s0" 
    alt="Carros - Relâmpago McQueen" 
    className="imagem-titulo"
  />
  <h1>Kachow Ideas ⚡</h1>
</header>

      <div className="corpo">
        <section className="formulario">
          {!editandoId ? (
            <>
                  <img 
                    src="https://www.pngall.com/wp-content/uploads/15/Rayo-Mcqueen-PNG-Cutout.png" 
                    alt="Relâmpago McQueen" 
                    className="imagem-formulario"
                  />
                  <h2 className='nomezinho'>Vroomm!!!</h2>
                  <form onSubmit={adicionarIdeia}>
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Digite sua ideia..."
                />
                <button type="submit">Adicionar Ideia</button>
              </form>
            </>
          ) : (
            <>
              <h2>Editar Ideia</h2>
              <form onSubmit={salvarEdicao}>
                <input
                  type="text"
                  value={textoEdicao}
                  onChange={(e) => setTextoEdicao(e.target.value)}
                />
                <div className="botoes">
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={cancelarEdicao} className="btn-cancelar">
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        <section className="lista">
          <h2>Suas Ideias</h2>

          {carregando && <p className="aviso">Caregando ideias...</p>}
          {erro && <p className="erro">{erro}</p>}
          
          {!carregando && !erro && ideias.length === 0 && (
            <p className="aviso">Nenhuma ideia ainda. Que tal criar a primeira?</p>
          )}

          {!carregando && !erro && ideias.length > 0 && (
            <div className="grade">
              {ideias.map(ideia => (
                <div 
                  key={ideia.id} 
                  className={`cartao ${ideia.completed ? 'feito' : ''}`}
                >
                  <h3>{ideia.completed ? <s>{ideia.title}</s> : ideia.title}</h3>
                  <span className="status">
                    {ideia.completed ? 'Executada' : 'Pendente'}
                  </span>
                  <div className="acoes">
                    <button onClick={() => alternarConcluida(ideia)}>
                      {ideia.completed ? 'Reabrir' : 'Concluir'}
                    </button>
                    <button onClick={() => começarEditar(ideia)}>Editar</button>
                    <button onClick={() => excluirIdeia(ideia)} className="btn-excluir">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App