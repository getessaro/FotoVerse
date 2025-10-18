// ========================================
// CONFIGURAÇÃO DA API UNSPLASH
// ========================================

// Chave de acesso da API Unsplash

const UNSPLASH_ACCESS_KEY =  "6CqWB77L1MSKn51WbAGicJvqAUrZVrUaJ4qGIkS68b8";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"

// Número de fotos por busca
const PHOTOS_PER_PAGE = 12

// ========================================
// ELEMENTOS DO DOM
// ========================================

const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const photoGrid = document.getElementById("photoGrid")
const loadingSpinner = document.getElementById("loadingSpinner")
const statusMessage = document.getElementById("statusMessage")

// Adiciona função para modo escuro
const toggleButton = document.getElementById ('theme-toggle');

// Verifica se o modo escuro estava ativo antes (salvo no localStorage)
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  toggleButton.textContent = '☀️';
} 
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Salva a preferência do usuário 
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    toggleButton.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    toggleButton.textContent = '🌙';
  }
});



// ========================================
// NAVEGAÇÃO SUAVE
// ========================================

// Adiciona scroll suave para links de navegação
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()

    // Remove classe active de todos os links
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))

    // Adiciona classe active ao link clicado
    this.classList.add("active")

    // Scroll suave para a seção
    const targetId = this.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// ========================================
// FUNÇÃO PARA BUSCAR FOTOS NA API
// ========================================

async function searchPhotos(query) {
  // Mostra loading e esconde mensagens anteriores
  showLoading()
  hideStatusMessage()

  // Limpa o grid de fotos
  photoGrid.innerHTML = ""

  try {
    // Monta a URL da requisição
    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=${PHOTOS_PER_PAGE}&client_id=${UNSPLASH_ACCESS_KEY}`

    // Faz a requisição para a API
    const response = await fetch(url)

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao buscar fotos. Verifique sua chave de API.")
    }

    const data = await response.json()

    // Esconde o loading
    hideLoading()

    // Verifica se encontrou resultados
    if (data.results.length === 0) {
      showStatusMessage("Nenhuma foto encontrada. Tente outro termo de busca.", "info")
      return
    }

    // Exibe as fotos
    displayPhotos(data.results)
  } catch (error) {
    console.error("Erro:", error)
    hideLoading()
    showStatusMessage("Erro ao carregar fotos. Por favor, tente novamente.", "error")
  }
}

// ========================================
// FUNÇÃO PARA EXIBIR FOTOS NO GRID
// ========================================

function displayPhotos(photos) {
  photos.forEach((photo, index) => {
    // Cria o card da foto
    const card = document.createElement("div")
    card.className = "photo-card"
    card.style.animationDelay = `${index * 0.1}s`

    // Monta o HTML do card
    card.innerHTML = `
            <img 
                src="${photo.urls.regular}" 
                alt="${photo.alt_description || "Foto do Unsplash"}"
                loading="lazy"
            >
            <div class="photo-info">
                <div class="photo-author">📸 ${photo.user.name}</div>
                <div class="photo-description">
                    ${photo.description || photo.alt_description || "Imagem inspiradora"}
                </div>
            </div>
        `

    // Adiciona evento de clique para abrir a foto no Unsplash
    card.addEventListener("click", () => {
      window.open(photo.links.html, "_blank")
    })

    // Adiciona o card ao grid
    photoGrid.appendChild(card)
  })
}

// ========================================
// FUNÇÕES DE UI (LOADING E MENSAGENS)
// ========================================

function showLoading() {
  loadingSpinner.classList.remove("hidden")
}

function hideLoading() {
  loadingSpinner.classList.add("hidden")
}

function showStatusMessage(message, type = "info") {
  statusMessage.textContent = message
  statusMessage.className = `status-message show ${type}`
}

function hideStatusMessage() {
  statusMessage.classList.remove("show")
}

// ========================================
// EVENT LISTENERS
// ========================================

// Busca ao clicar no botão
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim()

  if (query === "") {
    showStatusMessage("Por favor, digite um termo de busca.", "error")
    return
  }

  searchPhotos(query)
})

// Busca ao pressionar Enter no campo de busca
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click()
  }
})

// ========================================
// BUSCA INICIAL AO CARREGAR A PÁGINA
// ========================================

// Carrega fotos de "natureza" como padrão ao abrir o site
window.addEventListener("DOMContentLoaded", () => {
  searchInput.value = "natureza"
  searchPhotos("natureza")
})

// ========================================
// NOTA IMPORTANTE SOBRE A API KEY
// ========================================

// ATENÇÃO: Para o site funcionar, você precisa:
// 1. Criar uma conta gratuita em https://unsplash.com/developers
// 2. Criar um novo aplicativo para obter sua Access Key
// 3. Substituir 'YOUR_UNSPLASH_ACCESS_KEY' pela sua chave real
//
// A chave demo tem limite de 50 requisições por hora.
// Para uso em produção, use sua própria chave.
