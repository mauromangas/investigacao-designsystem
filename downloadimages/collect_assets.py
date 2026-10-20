import os
import json
from pathlib import Path
import requests
from PIL import Image
from io import BytesIO

# Diretório de destino alinhado com a estrutura do projeto
OUTPUT_DIR = Path("assets/images")
MANIFEST_PATH = OUTPUT_DIR / "imageManifest.json"

# Dicionário de ativos com metadados e URLs de origem para preenchimento
ASSETS_CONFIG = {
    "L0.N2": {
        "filename": "L0-N2-muller-brockmann-grid-systems.webp",
        "caption": "FIG. L0.N2 — Diagrama de grelha modular e páginas abertas (Josef Müller-Brockmann / Karl Gerstner, 1961/1964).",
        "sourceCredit": "Museum für Gestaltung Zürich / Lars Müller Publishers",
        "originalUrl": "", # Inserir URL direto de alta resolução
        "aspectRatio": "4/3"
    },
    "L0.N6": {
        "filename": "L0-N6-frutiger-univers-matrix-1957.webp",
        "caption": "FIG. L0.N6 — Matriz cartesiana original do sistema numérico Univers de Adrian Frutiger (1957).",
        "sourceCredit": "Deberny & Peignot / Adrian Frutiger Archive",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L1.N2": {
        "filename": "L1-N2-guardian-berliner-frontpage-2005.webp",
        "caption": "FIG. L1.N2 — Estreia do formato Berliner do The Guardian (12 de setembro de 2005). Direção de arte: Mark Porter.",
        "sourceCredit": "Mark Porter Associates / Eye Magazine",
        "originalUrl": "",
        "aspectRatio": "3/4"
    },
    "L1.N7": {
        "filename": "L1-N7-guardian-source-pillar-cards.webp",
        "caption": "FIG. L1.N7 — Amostra de cartões de artigos e diferenciação cromática por pilares no Design System Source.",
        "sourceCredit": "The Guardian / Storybook Docs",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L2.N3": {
        "filename": "L2-N3-bbc-gel-foundations-grid-2010.webp",
        "caption": "FIG. L2.N3 — Fundações visuais e grelha elástica de 16px no Global Experience Language (GEL, 2010).",
        "sourceCredit": "BBC GEL Archive",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L2.N5": {
        "filename": "L2-N5-bbc-reith-typography-dalton-maag.webp",
        "caption": "FIG. L2.N5 — Espécime tipográfico da família BBC Reith (Dalton Maag), focada em legibilidade e acessibilidade.",
        "sourceCredit": "Dalton Maag / BBC",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L3.N2": {
        "filename": "L3-N2-financial-times-pink-paper-print.webp",
        "caption": "FIG. L3.N2 — Impressão tradicional no papel salmão característico do Financial Times com densidade de tabelas.",
        "sourceCredit": "Financial Times Print Archive",
        "originalUrl": "",
        "aspectRatio": "4/3"
    },
    "L3.N6": {
        "filename": "L3-N6-ft-visual-vocabulary-poster.webp",
        "caption": "FIG. L3.N6 — Poster completo do FT Visual Vocabulary desenvolvido pela equipa de infografia do Financial Times.",
        "sourceCredit": "Financial Times / Alan Smith GitHub",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L4.N1": {
        "filename": "L4-N1-nyt-gray-lady-front-page-historical.webp",
        "caption": "FIG. L4.N1 — Primeira página histórica do The York Times (década de 1950) com estrutura de 8 colunas sem fotografia.",
        "sourceCredit": "The New York Times Archives",
        "originalUrl": "",
        "aspectRatio": "3/4"
    },
    "L4.N7": {
        "filename": "L4-N7-nyt-app-dark-light-mode-ink.webp",
        "caption": "FIG. L4.N7 — Comparação de tokens tipográficos e inversão de tinta (Modo Claro vs. Modo Escuro) na app do NYT.",
        "sourceCredit": "The New York Times R&D",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L5.N1": {
        "filename": "L5-N1-the-times-vs-the-sun-front-pages.webp",
        "caption": "FIG. L5.N1 — Contraste editorial e visual entre o The Times e o The Sun (News UK).",
        "sourceCredit": "News UK Archives",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L5.N7": {
        "filename": "L5-N7-newskit-theme-switcher-component.webp",
        "caption": "FIG. L5.N7 — Seletor de temas no NewsKit Design System aplicando tokens do The Times e The Sun no mesmo componente.",
        "sourceCredit": "NewsKit Design System",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L6.N2": {
        "filename": "L6-N2-publico-mark-porter-redesign-2006.webp",
        "caption": "FIG. L6.N2 — Redesenho do jornal Público por Mark Porter (2006) com espécime tipográfico de Mário Feliciano.",
        "sourceCredit": "Mark Porter Associates / Público",
        "originalUrl": "",
        "aspectRatio": "4/3"
    },
    "L6.N7": {
        "filename": "L6-N7-publico-pt-article-card-mobile.webp",
        "caption": "FIG. L6.N7 — Cartão de artigo em versão mobile no portal Público.pt.",
        "sourceCredit": "Público Digital",
        "originalUrl": "",
        "aspectRatio": "9/16"
    },
    "L7.N2": {
        "filename": "L7-N2-observador-pt-2014-launch-desktop.webp",
        "caption": "FIG. L7.N2 — Versão de lançamento do Observador.pt (maio de 2014) em formato desktop.",
        "sourceCredit": "Observador / Web Archive",
        "originalUrl": "",
        "aspectRatio": "16/9"
    },
    "L7.N7": {
        "filename": "L7-N7-observador-radio-mobile-player.webp",
        "caption": "FIG. L7.N7 — Integração de player de rádio e podcasts nos cartões de notícias mobile do Observador.",
        "sourceCredit": "Rádio Observador App",
        "originalUrl": "",
        "aspectRatio": "9/16"
    }
}

def process_image(url, output_path):
    if not url:
        print(f"[AVISO] URL em falta para {output_path.name}. Ignorando descarga remota.")
        return False
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        
        # Garantir largura mínima de 1600px mantendo o rácio
        min_width = 1600
        if img.width < min_width:
            ratio = min_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((min_width, new_height), Image.Resampling.LANCZOS)
            
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        img.save(output_path, "WEBP", quality=90)
        print(f"[SUCESSO] Processado e guardado: {output_path}")
        return True
    except Exception as e:
        print(f"[ERRO] Falha ao processar {url}: {e}")
        return False

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_data = {}
    
    for key, data in ASSETS_CONFIG.items():
        file_path = OUTPUT_DIR / data["filename"]
        # Tenta descarregar e otimizar se houver URL; caso contrário, regista metadados estruturais
        process_image(data["originalUrl"], file_path)
        
        manifest_data[key] = {
            "filename": data["filename"],
            "caption": data["caption"],
            "sourceCredit": data["sourceCredit"],
            "originalUrl": data["originalUrl"] if data["originalUrl"] else "Pendente",
            "aspectRatio": data["aspectRatio"]
        }
        
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=4, ensure_ascii=False)
    print(f"\n[INFO] Manifesto gerado com sucesso em: {MANIFEST_PATH}")

if __name__ == "__main__":
    main()