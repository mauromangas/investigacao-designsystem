import os
import json
import urllib.request
from urllib.parse import quote

# 1. Configuração da estrutura de pastas
OUTPUT_DIR = "assets/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 2. Base de dados de imagens a pesquisar e descarregar
IMAGE_TASKS = [
    {
        "coord": "L0.N2",
        "filename": "L0-N2-muller-brockmann-grid-systems.jpg",
        "query": "Josef Muller Brockmann Grid Systems in Graphic Design page layout grid",
        "caption": "FIG. L0.N2 — Diagrama de grelha modular por Josef Müller-Brockmann (1961).",
        "credit": "Museum für Gestaltung Zürich / Niggli Verlag"
    },
    {
        "coord": "L0.N6",
        "filename": "L0-N6-frutiger-univers-matrix-1957.jpg",
        "query": "Adrian Frutiger Univers numbering system matrix 1957",
        "caption": "FIG. L0.N6 — Matriz cartesiana da família Univers de Adrian Frutiger (1957).",
        "credit": "Deberny & Peignot Archive"
    },
    {
        "coord": "L1.N2",
        "filename": "L1-N2-guardian-berliner-frontpage-2005.jpg",
        "query": "The Guardian Berliner front page 12 September 2005 Mark Porter",
        "caption": "FIG. L1.N2 — Estreia do formato Berliner do The Guardian (12 de setembro de 2005).",
        "credit": "Mark Porter Associates / Guardian News & Media"
    },
    {
        "coord": "L1.N7",
        "filename": "L1-N7-guardian-source-pillar-cards.jpg",
        "query": "The Guardian Source design system pillar colors article cards",
        "caption": "FIG. L1.N7 — Cartões noticiosos estruturados pelos cinco pilares editoriais do Guardian Source.",
        "credit": "The Guardian Design Team"
    },
    {
        "coord": "L2.N3",
        "filename": "L2-N3-bbc-gel-foundations-grid-2010.jpg",
        "query": "BBC GEL Global Experience Language 2010 grid foundations",
        "caption": "FIG. L2.N3 — Grelha universal do BBC GEL (Global Experience Language, 2010).",
        "credit": "BBC GEL Framework"
    },
    {
        "coord": "L2.N5",
        "filename": "L2-N5-bbc-reith-typography-dalton-maag.jpg",
        "query": "BBC Reith typeface specimen Dalton Maag accessibility",
        "caption": "FIG. L2.N5 — Espécime tipográfico da família BBC Reith (Dalton Maag) focado em acessibilidade.",
        "credit": "BBC / Dalton Maag"
    },
    {
        "coord": "L3.N2",
        "filename": "L3-N2-financial-times-pink-paper-print.jpg",
        "query": "Financial Times printed paper pink background stock market tables",
        "caption": "FIG. L3.N2 — Página impressa de mercados do Financial Times no histórico tom FT Pink.",
        "credit": "Financial Times Archive"
    },
    {
        "coord": "L3.N6",
        "filename": "L3-N6-ft-visual-vocabulary-poster.jpg",
        "query": "Financial Times Visual Vocabulary poster Alan Smith github",
        "caption": "FIG. L3.N6 — Poster do FT Visual Vocabulary para categorização de gráficos estatísticos.",
        "credit": "Financial Times Graphics Team / Alan Smith"
    },
    {
        "coord": "L4.N1",
        "filename": "L4-N1-nyt-gray-lady-front-page-historical.jpg",
        "query": "New York Times front page 1950s 8 column text all text gray lady",
        "caption": "FIG. L4.N1 — Primeira página austera e textual do The New York Times (era Gray Lady).",
        "credit": "The New York Times Archives / TimesMachine"
    },
    {
        "coord": "L4.N7",
        "filename": "L4-N7-nyt-app-dark-light-mode-ink.jpg",
        "query": "New York Times app dark mode vs light mode side by side",
        "caption": "FIG. L4.N7 — Inversão semântica de tokens no The New York Times (Light vs. Dark Mode).",
        "credit": "The New York Times Digital Product Team"
    },
    {
        "coord": "L5.N1",
        "filename": "L5-N1-the-times-vs-the-sun-front-pages.jpg",
        "query": "The Times front page vs The Sun front page News UK",
        "caption": "FIG. L5.N1 — O contraste estético impresso entre o The Times e o The Sun no grupo News UK.",
        "credit": "News UK Archives"
    },
    {
        "coord": "L5.N7",
        "filename": "L5-N7-newskit-theme-switcher-component.jpg",
        "query": "NewsKit design system theme switcher The Times The Sun component",
        "caption": "FIG. L5.N7 — O mesmo componente multi-marca estilizado via tokens no NewsKit.",
        "credit": "NewsKit Design System / News UK"
    },
    {
        "coord": "L6.N2",
        "filename": "L6-N2-publico-mark-porter-redesign-2006.jpg",
        "query": "Jornal Publico Mark Porter redesign 2006 Mario Feliciano typography",
        "caption": "FIG. L6.N2 — Redesenho impresso do jornal Público por Mark Porter (2006).",
        "credit": "Mark Porter Associates / Commercial Type"
    },
    {
        "coord": "L7.N7",
        "filename": "L7-N7-observador-radio-mobile-player.jpg",
        "query": "Radio Observador mobile app player podcast article",
        "caption": "FIG. L7.N7 — Convergência de artigo de texto e player persistente da Rádio Observador.",
        "credit": "Observador / Equipa de Produto Digital"
    }
]

def fetch_image_url(query):
    """Procura uma imagem pública via DuckDuckGo Images API."""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    url = f"https://html.duckduckgo.com/html/?q={quote(query + ' filetype:jpg')}"
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')
        images = soup.find_all('img', class_='image__thumbnail')
        if images and 'src' in images[0].attrs:
            img_src = images[0]['src']
            if img_src.startswith('//'):
                return 'https:' + img_src
            return img_src
    except Exception as e:
        print(f"Erro ao pesquisar '{query}': {e}")
    return None

def main():
    manifest = {}
    print("🚀 A iniciar a recolha de imagens de arquivo...\n")
    
    for task in IMAGE_TASKS:
        filepath = os.path.join(OUTPUT_DIR, task['filename'])
        print(f"🔍 Pesquisando [{task['coord']}]: {task['query']}...")
        
        # Em ambiente de produção, este bloco faz a transferência real da imagem encontrada
        img_url = fetch_image_url(task['query'])
        if img_url:
            try:
                urllib.request.urlretrieve(img_url, filepath)
                print(f"  ✓ Guardado em: {filepath}")
            except Exception as e:
                print(f"  ❌ Falha no download de {img_url}: {e}")
        else:
            print(f"  ⚠️ Nenhuma imagem encontrada diretamente para a pesquisa.")

        # Adiciona os metadados ao manifesto JSON
        manifest[task['coord']] = {
            "filename": task['filename'],
            "filepath": f"/{OUTPUT_DIR}/{task['filename']}",
            "caption": task['caption'],
            "sourceCredit": task['credit'],
            "aspectRatio": "4/3"
        }

    # Guardar o ficheiro de manifesto JSON para a aplicação web
    manifest_path = os.path.join(OUTPUT_DIR, "imageManifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print(f"\n✅ Concluído! Manifesto criado em: {manifest_path}")

if __name__ == "__main__":
    main()