/**
 * MATRIZ GENEALÓGICA DE DESIGN SYSTEMS EDITORIAIS
 * Controlador Principal (Dual-Plane Navigation & Swiss Grid Keyboard Controller)
 * WCAG 2.2 AA / AAA Compliant
 */

(function () {
  'use strict';

  // Objeto de dados carregado via data.js
  const DATA = window.MATRIX_DATA;
  if (!DATA) {
    console.error('Erro crítico: MATRIX_DATA não foi carregado.');
    return;
  }

  // Estado da Aplicação
  const state = {
    selectedRow: 0, // Índice da linha (0 a 6 correspondendo a L0-L6)
    selectedCol: 1, // Índice da coluna (1 a 7 correspondendo a N1-N7)
    activeNodeCoord: null, // 'L0.N1' etc.
    isDetailOpen: false,
    isGuideOpen: false,
    lastFocusedCellElement: null,
    witnessState: {} // Estado interativo dos artefactos do Nó 7
  };

  // Mapeamentos de apoio
  const rowIds = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
  const colIds = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'];

  // Referências DOM
  const dom = {
    matrixTable: document.getElementById('matrixTable'),
    matrixScrollContainer: document.getElementById('matrixScrollContainer'),
    detailView: document.getElementById('nodeDetailView'),
    detailCoordBadge: document.getElementById('detailCoordBadge'),
    detailEntityName: document.getElementById('detailEntityName'),
    detailColName: document.getElementById('detailColName'),
    detailBreadcrumbSub: document.getElementById('detailBreadcrumbSub'),
    detailTagsRow: document.getElementById('detailTagsRow'),
    detailNodeTitle: document.getElementById('detailNodeTitle'),
    detailSystemSubtitle: document.getElementById('detailSystemSubtitle'),
    detailProseContent: document.getElementById('detailProseContent'),
    detailCrossReferences: document.getElementById('detailCrossReferences'),
    detailWitnessCol: document.getElementById('detailWitnessCol'),
    detailBodyGrid: document.getElementById('detailBodyGrid'),
    closeDetailBtn: document.getElementById('closeDetailBtn'),
    btnPrevNode: document.getElementById('btnPrevNode'),
    btnNextNode: document.getElementById('btnNextNode'),
    btnUpNode: document.getElementById('btnUpNode'),
    btnDownNode: document.getElementById('btnDownNode'),
    prevNodeName: document.getElementById('prevNodeName'),
    nextNodeName: document.getElementById('nextNodeName'),
    upNodeName: document.getElementById('upNodeName'),
    downNodeName: document.getElementById('downNodeName'),
    statusBarFocusCoord: document.getElementById('statusBarFocusCoord'),
    activeCoordDisplay: document.getElementById('active-coord-display'),
    welcomeModal: document.getElementById('welcomeModal'),
    btnCloseGuideModal: document.getElementById('btnCloseGuideModal'),
    btnStartExploring: document.getElementById('btnStartExploring'),
    btnOpenGuide: document.getElementById('btnOpenGuide'),
    btnStatusBarGuide: document.getElementById('btnStatusBarGuide'),
    chkDoNotShowGuideAgain: document.getElementById('chkDoNotShowGuideAgain')
  };

  // Helper para obter dados de um nó por coordenadas
  function getNodeData(coord) {
    const parts = coord.split('.');
    const rowId = parts[0];
    const colId = parts[1];
    const row = DATA.rows.find(r => r.rowId === rowId);
    if (!row || !row.nodes || !row.nodes[colId]) return null;
    return {
      node: row.nodes[colId],
      row: row,
      column: DATA.columns.find(c => c.id === colId)
    };
  }

  // ==========================================================================
  // RENDERIZAÇÃO DO PLANO 1: MATRIZ PANORÂMICA
  // ==========================================================================
  function renderMatrix() {
    dom.matrixTable.innerHTML = '';

    // 1. Canto Superior Esquerdo
    const cornerCell = document.createElement('div');
    cornerCell.className = 'matrix-corner-cell';
    cornerCell.innerHTML = `
      <span class="corner-label">EIXO GENEALÓGICO</span>
      <span class="corner-caption">CASOS / DIMENSÕES</span>
    `;
    dom.matrixTable.appendChild(cornerCell);

    // 2. Cabeçalhos de Colunas (N1 a N7)
    DATA.columns.forEach((col, colIndex) => {
      const colHeader = document.createElement('div');
      const isPreDigital = colIndex < 2;
      colHeader.className = `matrix-col-header ${isPreDigital ? 'col-predigital' : 'col-digital'}`;
      colHeader.setAttribute('role', 'columnheader');
      colHeader.innerHTML = `
        <div class="col-header-top">
          <span class="col-id-badge">${col.id}</span>
          <span class="col-phase-badge">${col.phase}</span>
        </div>
        <div>
          <h2 class="col-name">${col.name}</h2>
          <p class="col-sub">${col.subtitle}</p>
        </div>
      `;
      dom.matrixTable.appendChild(colHeader);
    });

    // 3. Linhas da Matriz (L0 a L6)
    DATA.rows.forEach((row, rowIndex) => {
      // Cabeçalho da Linha (Lado Esquerdo Fixo)
      const rowHeader = document.createElement('div');
      rowHeader.className = 'matrix-row-header';
      rowHeader.setAttribute('role', 'rowheader');
      rowHeader.innerHTML = `
        <div>
          <span class="row-id-badge">${row.rowId}</span>
          <h3 class="row-entity-title">${row.entity}</h3>
          <p class="row-system-name">${row.systemName}</p>
        </div>
        <div class="row-meta-bottom">
          <span>${row.country}</span>
          <span>${row.period}</span>
        </div>
      `;
      dom.matrixTable.appendChild(rowHeader);

      // Células dos Nós (N1 a N7)
      colIds.forEach((colId, colIndex) => {
        const node = row.nodes[colId];
        const coord = `${row.rowId}.${colId}`;
        const isPreDigital = colIndex < 2;

        const cell = document.createElement('article');
        cell.className = `matrix-node-cell ${isPreDigital ? 'cell-predigital' : 'cell-digital'}`;
        cell.id = `cell-${coord}`;
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `${coord}: ${node.title} — ${row.entity}`);
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex + 1;
        cell.dataset.coord = coord;

        // Caso particular: News UK (L5) Nós N1 e N2 mostram textura diagonal (silos pré-digitais)
        if (row.rowId === 'L5' && (colId === 'N1' || colId === 'N2')) {
          cell.classList.add('cell-hatched');
        }

        // Caso particular: Observador (L7) Nós N1 e N2 nascidos diretamente na era digital
        const isBornDigital = !!node.isBornDigitalPreHistory;
        if (isBornDigital) {
          cell.classList.add('cell-born-digital');
        }

        // Tags resumidas (máx 2)
        const tagsHtml = (node.tags || []).slice(0, 2).map(tag => `<span class="node-mini-tag">${tag}</span>`).join('');

        if (colId === 'N3') {
          cell.classList.add('card-rhythm-opinion');
        }

        const phaseLabel = (colId === 'N1' || colId === 'N2') ? 'PRÉ-DIGITAL' : (isBornDigital ? 'NATIVO DIGITAL' : 'DIGITAL');
        const phaseClass = (colId === 'N1' || colId === 'N2') ? 'phase-badge-predigital' : (isBornDigital ? 'phase-badge-borndigital' : 'phase-badge-digital');

        cell.innerHTML = `
          <div class="node-cell-top">
            <span class="node-cell-coord">[${coord}]</span>
            <div class="node-cell-tags">
              <span class="node-phase-badge ${phaseClass}">${phaseLabel}</span>
              ${colId === 'N7' ? '<span class="node-witness-indicator">ARTEFACTO</span>' : ''}
              ${tagsHtml}
            </div>
          </div>
          <h4 class="node-cell-title">${node.title}</h4>
          <p class="node-cell-excerpt">${node.content}</p>
          <div class="node-cell-bottom">
            <span class="node-action-hint">ENTER ABRIR</span>
          </div>
        `;

        // Interação por Clique
        cell.addEventListener('click', () => {
          setSelectedCell(rowIndex, colIndex + 1, false);
          openNodeDetail(coord);
        });

        // Foco de Teclado
        cell.addEventListener('focus', () => {
          setSelectedCell(rowIndex, colIndex + 1, false);
        });

        dom.matrixTable.appendChild(cell);
      });
    });

    // Atribui seleção inicial ao primeiro nó [L0.N1]
    updateSelectedCellUI(false);
  }

  // ==========================================================================
  // GESTÃO DE ESTADO & NAVEGAÇÃO DA GRELHA SUÍÇA
  // ==========================================================================
  function setSelectedCell(rowIndex, colIndex, shouldScroll = true) {
    state.selectedRow = Math.max(0, Math.min(rowIds.length - 1, rowIndex));
    state.selectedCol = Math.max(1, Math.min(colIds.length, colIndex));

    const coord = `${rowIds[state.selectedRow]}.${colIds[state.selectedCol - 1]}`;
    state.activeNodeCoord = coord;

    updateSelectedCellUI(shouldScroll);
  }

  function updateSelectedCellUI(shouldScroll = false) {
    const currentCoord = `${rowIds[state.selectedRow]}.${colIds[state.selectedCol - 1]}`;
    
    // Remover classes selecionadas anteriores
    document.querySelectorAll('.matrix-node-cell.is-selected').forEach(c => {
      c.classList.remove('is-selected');
    });

    const activeCell = document.getElementById(`cell-${currentCoord}`);
    if (activeCell) {
      activeCell.classList.add('is-selected');
      if (shouldScroll) {
        ensureCellVisible(activeCell);
      }
    }

    // Atualizar Barra de Estado
    const nodeInfo = getNodeData(currentCoord);
    if (nodeInfo) {
      if (dom.statusBarFocusCoord) dom.statusBarFocusCoord.textContent = `${currentCoord} — ${nodeInfo.row.entity}: ${nodeInfo.node.title}`;
      if (dom.activeCoordDisplay) dom.activeCoordDisplay.textContent = `[${currentCoord}] ${nodeInfo.row.entity.toUpperCase()}`;
    }
  }

  /**
   * Garante a visibilidade total da célula tendo em conta a coluna fixa da esquerda
   * e a linha de cabeçalho fixa do topo (adaptativo para mobile e desktop).
   */
  function ensureCellVisible(cell) {
    const container = dom.matrixScrollContainer;
    if (!container) return;

    const isMobile = window.innerWidth <= 900;
    const stickyColWidth = isMobile ? 142 : 246; // Largura do cabeçalho da linha + gap
    const stickyHeaderHeight = isMobile ? 74 : 90; // Altura aproximada do cabeçalho de coluna

    const cellRect = cell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Distância da célula em relação à borda esquerda visível da área de scroll útil (após a coluna fixa)
    const effectiveLeft = containerRect.left + stickyColWidth;
    const effectiveRight = containerRect.right;

    // Scroll Horizontal
    if (cellRect.left < effectiveLeft) {
      // A célula está escondida por baixo da coluna fixa da esquerda
      const scrollDiff = effectiveLeft - cellRect.left + 16;
      container.scrollBy({ left: -scrollDiff, behavior: 'smooth' });
    } else if (cellRect.right > effectiveRight) {
      // A célula está cortada à direita
      const scrollDiff = cellRect.right - effectiveRight + 24;
      container.scrollBy({ left: scrollDiff, behavior: 'smooth' });
    }

    // Scroll Vertical
    const effectiveTop = containerRect.top + stickyHeaderHeight;
    const effectiveBottom = containerRect.bottom;

    if (cellRect.top < effectiveTop) {
      const scrollDiff = effectiveTop - cellRect.top + 16;
      container.scrollBy({ top: -scrollDiff, behavior: 'smooth' });
    } else if (cellRect.bottom > effectiveBottom) {
      const scrollDiff = cellRect.bottom - effectiveBottom + 24;
      container.scrollBy({ top: scrollDiff, behavior: 'smooth' });
    }
  }

  // ==========================================================================
  // PLANO 2: VIEW DE NÓ (PLANO DE LEITURA PROFUNDA)
  // ==========================================================================
  function openNodeDetail(coord) {
    const data = getNodeData(coord);
    if (!data) return;

    state.isDetailOpen = true;
    state.activeNodeCoord = coord;
    state.lastFocusedCellElement = document.activeElement;

    // A cor de fundo do nó fica exatamente da cor da respetiva célula
    const colId = coord.split('.')[1];
    const nodePanel = dom.detailView.querySelector('.node-detail-panel');
    if (nodePanel) {
      nodePanel.classList.remove('panel-predigital', 'panel-opinion', 'panel-digital');
      let activeBg = 'var(--surface-cell)';

      if (colId === 'N1' || colId === 'N2') {
        nodePanel.classList.add('panel-predigital');
        activeBg = 'var(--surface-predigital)';
      } else if (colId === 'N3') {
        nodePanel.classList.add('panel-opinion');
        activeBg = 'var(--surface-paper-elevated)';
      } else {
        nodePanel.classList.add('panel-digital');
        activeBg = 'var(--surface-cell)';
      }

      nodePanel.style.setProperty('--active-node-bg', activeBg);
      nodePanel.style.backgroundColor = activeBg;

      const topBar = dom.detailView.querySelector('.detail-top-bar');
      const scrollArea = dom.detailView.querySelector('.detail-scroll-area');
      const navFooter = dom.detailView.querySelector('.detail-nav-footer');
      if (topBar) topBar.style.backgroundColor = activeBg;
      if (scrollArea) scrollArea.style.backgroundColor = activeBg;
      if (navFooter) navFooter.style.backgroundColor = activeBg;
    }

    // Preenchimento dos dados do Nó
    dom.detailCoordBadge.textContent = `[${coord}]`;
    dom.detailEntityName.textContent = data.row.entity;
    dom.detailColName.textContent = data.column.name;
    dom.detailBreadcrumbSub.textContent = `${data.row.country}, (${data.row.period}) / ${data.column.phase}`;
    
    dom.detailNodeTitle.textContent = data.node.title;
    dom.detailSystemSubtitle.textContent = `Sistema: ${data.row.systemName} · Arquétipo: ${data.row.archetype}`;

    // Tags
    dom.detailTagsRow.innerHTML = data.node.tags.map(t => `<span class="detail-tag">[${t}]</span>`).join('');

    // Texto Prosa Completo
    dom.detailProseContent.innerHTML = `<p>${data.node.content}</p>`;

    // Cross-References se aplicável
    renderCrossReferences(coord);

    // Coluna Lateral (Artefacto para Nó 7 ou Metadados do Sistema para Nós 1-6)
    if (coord.endsWith('.N7')) {
      dom.detailBodyGrid.classList.remove('single-column');
      dom.detailWitnessCol.style.display = 'flex';
      renderWitnessComponent(coord, data);
    } else {
      // Para nós 1 a 6, exibe painel lateral técnico complementar
      dom.detailBodyGrid.classList.remove('single-column');
      dom.detailWitnessCol.style.display = 'flex';
      renderContextPanel(data);
    }

    // Atualizar Botões de Navegação Adjacente
    updateAdjacencyButtons(coord);

    // Exibir Modal
    dom.detailView.classList.add('is-active');
    dom.detailView.setAttribute('aria-hidden', 'false');

    // Foco de Acessibilidade
    dom.closeDetailBtn.focus();
  }

  function closeNodeDetail() {
    state.isDetailOpen = false;
    dom.detailView.classList.remove('is-active');
    dom.detailView.setAttribute('aria-hidden', 'true');

    // Devolve o foco à última célula selecionada na grelha
    const currentCoord = `${rowIds[state.selectedRow]}.${colIds[state.selectedCol - 1]}`;
    const cell = document.getElementById(`cell-${currentCoord}`);
    if (cell) {
      cell.focus();
    }
  }

  // Cross-References Genealógicas
  function renderCrossReferences(coord) {
    dom.detailCrossReferences.innerHTML = '';
    const matches = DATA.crossReferences.filter(cr => cr.from === coord || cr.to === coord);
    if (matches.length > 0) {
      const title = document.createElement('h4');
      title.className = 'technical-label';
      title.textContent = 'LIGAÇÕES GENEALÓGICAS';
      dom.detailCrossReferences.appendChild(title);

      matches.forEach(m => {
        const card = document.createElement('div');
        card.className = 'cross-ref-card';
        card.innerHTML = `
          <div class="cross-ref-header">${m.from} ➔ ${m.to}</div>
          <div class="cross-ref-text">${m.relation}</div>
        `;
        dom.detailCrossReferences.appendChild(card);
      });
    }
  }

  // Painel Lateral para Nós N1 a N6
  function renderContextPanel(data) {
    dom.detailWitnessCol.innerHTML = `
      <div class="witness-header">
        <h4 class="witness-title">ENQUADRAMENTO</h4>
        <span class="witness-badge">${data.column.id}</span>
      </div>
      <div class="witness-canvas" style="justify-content: flex-start; gap: 1.5rem;">
        <div>
          <span class="technical-label">CASO DE ESTUDO</span>
          <div style="font-weight: 700; font-size: 1.15rem; margin-bottom: 0.25rem;">${data.row.entity}</div>
          <div style="font-size: 13px; color: var(--ink-secondary);">${data.row.systemName}</div>
        </div>
        <div>
          <span class="technical-label">DIMENSÃO ANALÍTICA</span>
          <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem;">${data.column.name}</div>
          <div style="font-size: 13px; color: var(--ink-secondary);">${data.column.subtitle}</div>
        </div>
        <div>
          <span class="technical-label">CRONOLOGIA &amp; GEOGRAFIA</span>
          <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 600;">${data.row.period} · ${data.row.country}</div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // RENDERIZAÇÃO DO COMPONENTE-TESTEMUNHA (NÓ 7)
  // ==========================================================================
  function renderWitnessComponent(coord, data) {
    const witness = data.node.witnessComponent;
    if (!witness) return;

    let canvasHtml = '';
    let controlsHtml = '';

    if (coord === 'L0.N7') {
      // Escola Suíça: Grelha Modular Matemática
      canvasHtml = `
        <div id="swissGridSpecimen" class="swiss-specimen-grid ratio-3x4">
          <div class="swiss-grid-cell highlight-black">M01</div>
          <div class="swiss-grid-cell span-2">TITULO ASYMMÉTRICO</div>
          <div class="swiss-grid-cell highlight-red">M04 RED</div>
          <div class="swiss-grid-cell">TEXTO A</div>
          <div class="swiss-grid-cell">TEXTO B</div>
          <div class="swiss-grid-cell span-2">CORPO MODULAR</div>
          <div class="swiss-grid-cell highlight-black">M09</div>
          <div class="swiss-grid-cell">M10</div>
          <div class="swiss-grid-cell">M11</div>
          <div class="swiss-grid-cell highlight-red">M12 RED</div>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn" id="btnToggleLines">Alternar Linhas da Grelha</button>
      `;
    } else if (coord === 'L1.N7') {
      // Guardian Source: Theming dos 5 Pilares
      canvasHtml = `
        <div id="guardianCardSpecimen" class="guardian-card-specimen">
          <div id="guardianStripe" class="guardian-pillar-stripe" style="background-color: var(--pillar-news);"></div>
          <div class="guardian-card-inner">
            <div id="guardianKicker" class="guardian-kicker" style="color: var(--pillar-news);">NEWS · EXCLUSIVO</div>
            <h4 class="guardian-headline">The Guardian Source Design System: Da Cor Impressa ao Token de Código</h4>
            <p class="guardian-trail">O motor de theming atómico permite que o mesmo componente adapte filetes e cabeçalhos em função da secção editorial sem duplicar estilos.</p>
            <div class="guardian-meta">
              <span>HÁ 15 MINUTOS</span>
              <span>LONDRES</span>
            </div>
          </div>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn active" data-pillar="news" style="border-bottom: 3px solid var(--pillar-news);">News</button>
        <button class="witness-ctrl-btn" data-pillar="opinion" style="border-bottom: 3px solid var(--pillar-opinion);">Opinion</button>
        <button class="witness-ctrl-btn" data-pillar="sport" style="border-bottom: 3px solid var(--pillar-sport);">Sport</button>
        <button class="witness-ctrl-btn" data-pillar="culture" style="border-bottom: 3px solid var(--pillar-culture);">Culture</button>
        <button class="witness-ctrl-btn" data-pillar="lifestyle" style="border-bottom: 3px solid var(--pillar-lifestyle);">Lifestyle</button>
      `;
    } else if (coord === 'L2.N7') {
      // BBC GEL: Escala Clássica e Áreas de Toque 44px
      canvasHtml = `
        <div class="bbc-card-specimen">
          <div class="bbc-spec-trafalgar">
            BBC News Headline in Trafalgar Scale
            <span class="type-scale-badge">Trafalgar (32px/36px)</span>
          </div>
          <p class="bbc-spec-body">
            Este parágrafo utiliza a escala histórica 'Body Copy' (15px) desenhada pela Dalton Maag na família tipográfica BBC Reith.
            <span class="type-scale-badge" style="top: auto; bottom: 0;">Body Copy (15px)</span>
          </p>
          <div id="bbcTouchBox" class="bbc-touch-target-box">
            <span>LER ARTIGO COMPLETO</span>
            <div id="bbcTouchOverlay" class="touch-target-overlay"></div>
          </div>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn" id="btnToggleBbcTarget">Assinalar Área de Toque Mínima (44×44px)</button>
      `;
    } else if (coord === 'L3.N7') {
      // FT Origami: Papel Salmão e Vocabulário de Dados
      canvasHtml = `
        <div class="ft-card-specimen">
          <span class="ft-tag">MARKETS &amp; ECONOMY</span>
          <h4 class="ft-headline">Financial Times Origami: Ergonomia sobre Superfície Salmão Oficial</h4>
          <p style="font-size: 13px; line-height: 1.45; margin-bottom: 0.75rem;">A cor #FFF1E5 reduz a fadiga ocular em sessões prolongadas de análise financeira, garantindo contraste AAA.</p>
          <div class="ft-mini-chart">
            <div style="font-family: var(--font-mono); font-size: 10px; margin-bottom: 4px; color: #555;">FT VISUAL VOCABULARY: BARRAS COMPARATIVAS</div>
            <div class="ft-chart-bars">
              <div class="ft-bar" style="height: 45%;"></div>
              <div class="ft-bar" style="height: 70%;"></div>
              <div class="ft-bar" style="height: 100%;"></div>
              <div class="ft-bar" style="height: 60%;"></div>
              <div class="ft-bar" style="height: 85%;"></div>
            </div>
          </div>
          <div>
            <span class="ft-contrast-badge">CONTRASTE 11.2:1 AAA</span>
          </div>
        </div>
      `;
      controlsHtml = '';
    } else if (coord === 'L4.N7') {
      // NYT Ink: Alternância Dark Mode / Light Mode
      canvasHtml = `
        <div id="nytSpecimenCard" class="nyt-card-specimen light-mode">
          <div style="font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; margin-bottom: 0.35rem; color: #666;">
            The New York Times · Ink System
          </div>
          <h4 class="nyt-headline">Da Gray Lady ao Sistema Ink: Inversão Semântica de Tokens</h4>
          <p class="nyt-summary">Mapeamento em camadas de tokens semânticos permite alternar a relação histórica de tinta preta sobre papel branco para Modo Escuro sem perder contraste.</p>
          <div class="nyt-audio-player">
            <span>▶ 12:45 OUVIR ARTIGO</span>
            <span style="margin-left: auto;">VELOCIDADE 1.0×</span>
          </div>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn active" id="btnNytLight">Modo Claro (Papel)</button>
        <button class="witness-ctrl-btn" id="btnNytDark">Modo Escuro (Ink Dark)</button>
      `;
    } else if (coord === 'L5.N7') {
      // NewsKit: Componente Camaleão (The Times vs The Sun)
      canvasHtml = `
        <div id="newskitCard" class="newskit-card-specimen theme-times">
          <div class="chameleon-header">
            THE TIMES — COURT &amp; POLITICS
          </div>
          <h4 class="chameleon-title">NewsKit Multi-Brand Architecture: Um Código, Duas Culturas Editoriais</h4>
          <p style="font-size: 13px; line-height: 1.45; margin: 0.75rem 0;">A mesma estrutura DOM e os mesmos atributos de acessibilidade são vestidos por variáveis de token completamente opostas.</p>
          <div style="font-family: var(--font-mono); font-size: 11px; opacity: 0.8;">BREAKING NEWS NOTIFICATION · LIVE</div>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn active" id="btnThemeTimes">Tema: The Times (Serif, 0px)</button>
        <button class="witness-ctrl-btn" id="btnThemeSun">Tema: The Sun (Sans, 8px, Red)</button>
      `;
    } else if (coord === 'L6.N7') {
      // Público / Caso Português: Diagnóstico e Auditoria WCAG
      canvasHtml = `
        <div id="ptAuditCard" class="portugal-audit-specimen">
          <div id="ptAuditBadge" class="audit-flag fail">FALHA WCAG 1.4.3 (3.5:1)</div>
          <div id="ptMetaLine" class="pt-meta-line meta-original">
            POR REDAÇÃO PÚBLICO · 17 OUTUBRO 2026, 19:45
          </div>
          <h4 class="pt-headline">
            <span class="pt-headline-accent">Público:</span> Análise Crítica da Tipografia e Acessibilidade Digital
          </h4>
          <p style="font-size: 13px; line-height: 1.5; color: #222;">
            O estudo de caso nacional revela a oportunidade de uma nova arquitetura de tokens que resolva os défices de contraste luminoso em metadados sob o DL n.º 82/2022.
          </p>
        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn active" id="btnAuditOriginal">Modo Original (Falha Contraste #888)</button>
        <button class="witness-ctrl-btn" id="btnAuditFixed">Proposta DS Mestrado (Correção #525 AAA)</button>
      `;
    } else if (coord === 'L7.N7') {
      // Observador / Nativo Digital: Três Organismos Reais Baseados na Anatomia da Publicação
      canvasHtml = `
        <div id="obsSystemContainer" class="obs-system-container">
          
          <!-- Organismo 1: Grelha da Home (Destaques, Liveblogs e Módulos Temáticos) -->
          <div id="obsHomeView" class="obs-view-pane is-active">
            <div class="obs-wine-ribbon">
              <span>Já somos quase 50.000. Assine e receba 1 garrafa de vinho.</span>
              <button class="obs-pill-subscribe-btn">Assinar</button>
            </div>
            <div class="obs-sponsor-subribbon">
              <span class="obs-switch-dot">◐</span> 1242,2 kWh poupados com a <strong>XPENG</strong> ⓘ
            </div>

            <div class="obs-home-grid">
              <!-- Coluna 1: Manchete Principal -->
              <div class="obs-home-main-col">
                <div class="obs-photo-placeholder lead-photo">
                  <span class="photo-badge">FOTO: ZELENSKY &amp; TRUMP</span>
                </div>
                <div class="obs-kicker-row">
                  <span class="obs-kicker-flag">🇺🇦 GUERRA NA UCRÂNIA</span>
                </div>
                <h3 class="obs-lead-headline">A corda entre Zelensky e Trump partiu de vez?</h3>
                <p class="obs-lead-text">
                  No espaço de uma semana, Ucrânia enfrentou falhas no Starlink e nas informações militares vindas dos EUA. Trump, pressionado pelas intercalares, aponta a Zelensky. É um ponto de não-retorno?
                </p>
              </div>

              <!-- Coluna 2: Destaque Secundário & Última Hora -->
              <div class="obs-home-sub-col">
                <div class="obs-sub-card">
                  <div class="obs-photo-placeholder sub-photo">
                    <span class="photo-badge">LISBOA / ACAMPADA</span>
                  </div>
                  <span class="obs-micro-kicker">MANIFESTAÇÕES</span>
                  <h4 class="obs-sub-title">"É para aguentar." A primeira noite de acampada em Lisboa</h4>
                </div>

                <div class="obs-compact-list">
                  <div class="obs-list-item">
                    <div class="obs-thumb-box">FOTO</div>
                    <div class="obs-item-content">
                      <span class="obs-micro-kicker">MANIFESTAÇÕES</span>
                      <p class="obs-item-title">A madrugada da "revolução" sem polícia na Praça D. João I</p>
                    </div>
                  </div>

                  <div class="obs-list-item">
                    <div class="obs-thumb-box">FOTO</div>
                    <div class="obs-item-content">
                      <span class="obs-micro-kicker">PROTESTOS</span>
                      <p class="obs-item-title"><span class="obs-live-badge">Em direto/</span> Porto no 9.º dia de protestos. Lisboa realiza assembleia</p>
                    </div>
                  </div>

                  <div class="obs-list-item">
                    <div class="obs-thumb-box">📷</div>
                    <div class="obs-item-content">
                      <span class="obs-micro-kicker">MANIFESTAÇÕES</span>
                      <p class="obs-item-title">As imagens dos protestos no Porto e em Lisboa</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Coluna 3: Fluxos Temáticos Verticais -->
              <div class="obs-home-stream-col">
                <div class="obs-stream-block">
                  <span class="obs-stream-kicker">COMPRAS</span>
                  <h5 class="obs-stream-title">Relógios, ténis, mobiliário: 23 lojas novas de norte a sul</h5>
                  <p class="obs-stream-excerpt">Da rua aos centros comerciais, incluindo formato outlet, várias marcas abriram portas...</p>
                </div>

                <div class="obs-stream-block">
                  <span class="obs-stream-kicker">PODCASTS</span>
                  <h5 class="obs-stream-title">O regresso de “A Caça ao Estripador de Lisboa”</h5>
                  <p class="obs-stream-excerpt">Mais de 30 anos após o homicídio de três mulheres em Lisboa que chocou o país...</p>
                </div>

                <div class="obs-stream-block">
                  <span class="obs-stream-kicker">PODCAST PLUS</span>
                  <h5 class="obs-stream-title">"A Caça ao Estripador de Lisboa" é agora um teatro imersivo</h5>
                  <p class="obs-stream-excerpt">O Podcast Plus transformado num espetáculo dá nova vida à investigação...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Organismo 2: Artigo Editorial com Áudio & Metadados -->
          <div id="obsArticleView" class="obs-view-pane">
            <div class="obs-wine-ribbon">
              <span>Já somos quase 50.000. Assine e receba 1 garrafa de vinho.</span>
              <button class="obs-pill-subscribe-btn">Assinar</button>
            </div>

            <div class="obs-article-header">
              <div class="obs-art-kicker-row">
                <span class="obs-topic-kicker">PODCASTS / PODCAST PLUS</span>
                <button class="obs-btn-alert">🔔 Ativar alertas</button>
              </div>

              <h2 class="obs-article-headline">
                "A Caça ao Estripador de Lisboa": o Podcast Plus do Observador transforma-se em espectáculo de teatro imersivo
              </h2>

              <p class="obs-article-lead">
                O Podcast Plus transformado num espetáculo dá nova vida à investigação do assassino em série que aterrorizou Lisboa nos anos 90. Estreia-se a 28 de outubro e os bilhetes já estão à venda.
              </p>

              <!-- Barra de Ferramentas de Utilidade do Leitor (Observador UI) -->
              <div class="obs-reader-toolbar">
                <button id="btnAudioArticlePill" class="obs-reader-pill obs-audio-pill" aria-label="Ouvir Artigo">
                  <span class="pill-icon">🎧</span> <span id="lblAudioState">6 min</span>
                </button>
                <button class="obs-reader-pill" aria-label="Comentários">
                  <span class="pill-icon">💬</span> 1
                </button>
                <div class="obs-reader-icons">
                  <button class="obs-icon-action-btn" title="Guardar">🔖</button>
                  <button class="obs-icon-action-btn" title="Oferecer Artigo">🎁</button>
                  <button class="obs-icon-action-btn" title="Partilhar">↗</button>
                </div>
              </div>

              <!-- Módulo de Áudio Integrado -->
              <div id="obsInlineAudioPlayer" class="obs-inline-player" style="display: none;">
                <button id="btnPlayArticleAudio" class="obs-play-btn" aria-label="Reproduzir">
                  <span id="obsPlayIcon" class="play-icon">▶</span>
                </button>
                <div class="obs-player-info">
                  <div class="obs-player-track">PODCAST PLUS: A CAÇA AO ESTRIPADOR DE LISBOA</div>
                  <div class="obs-player-sub">EMISSÃO RÁDIO OBSERVADOR · 06:12 MIN · 98.7 FM</div>
                </div>
                <div class="obs-audio-progress-bar">
                  <div id="obsAudioFillBar" class="obs-progress-fill"></div>
                </div>
              </div>
            </div>

            <div class="obs-article-layout">
              <!-- Coluna Esquerda: Autoria & As Mais Lidas -->
              <aside class="obs-article-aside">
                <div class="obs-author-card">
                  <div class="obs-author-photo">MC</div>
                  <div class="obs-author-meta">
                    <strong>Mariana Carvalho</strong>
                    <span>Texto</span>
                  </div>
                </div>
                <div class="obs-timestamp">06 out. 2026, 15:33</div>
                
                <div class="obs-quote-caption">
                  ► "A encenação tem o objetivo de fazer o espectador compreender o lado de cada uma das 'personagens' desta história", diz Simão Biernat, encenador.
                </div>

                <div class="obs-most-read-box">
                  <h5 class="obs-most-read-title">As mais lidas</h5>
                  <ul class="obs-most-read-list">
                    <li><span class="obs-bullet">•</span> Centenas de acampados em Lisboa e no Porto</li>
                    <li><span class="obs-bullet">•</span> "É para aguentar." A primeira noite de acampada em Lisboa</li>
                    <li><span class="obs-bullet">•</span> As lealdades da seita</li>
                    <li><span class="obs-bullet">•</span> Como mais 2 linhas e Gare do Oriente renovada mudam Lisboa</li>
                  </ul>
                </div>
              </aside>

              <!-- Coluna Central: Conteúdo do Artigo -->
              <div class="obs-article-main">
                <div class="obs-photo-placeholder article-photo">
                  <span class="photo-badge">TEATRO IMERSIVO / ESTRIPADOR DE LISBOA</span>
                </div>

                <div class="obs-article-prose">
                  <p>
                    Entre 1992 e 1993, a polícia registou cinco homicídios de prostitutas na região da Grande Lisboa, três dos quais aparentavam estar relacionados. Depressa se difundiu a ideia de que existia um assassino em série à solta na capital, cuja identidade a investigação nunca conseguiu revelar — apesar de todos os esforços mobilizados e do apoio do FBI, que interveio e modernizou as práticas da Polícia Judiciária. Em 2024, o caso foi contado com pormenores no <a href="#" class="obs-body-link">Podcast Plus do Observador, A Caça ao Estripador de Lisboa</a>, nome com o qual a imprensa da época batizou o <em>serial killer</em>.
                  </p>
                  <div class="obs-pub-separator">
                    <span>PUB • CONTINUE A LER A SEGUIR</span>
                  </div>
                  <p>
                    Agora, a investigação jornalística salta do áudio para o palco físico com encenação imersiva que coloca os espectadores no centro dos interrogatórios policiais da época...
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Organismo 3: Paywall Dinâmica de Assinantes (Conversão) -->
          <div id="obsPaywallView" class="obs-view-pane">
            <div class="obs-paywall-teaser">
              <div class="obs-author-compact">
                <div class="obs-author-photo small">CB</div>
                <div><strong>Cátia Bruno</strong> · <span>Texto</span> · <small>18 out. 2026, 11:57</small></div>
              </div>
              <p class="obs-teaser-lead">
                No espaço de uma semana, Ucrânia enfrentou falhas no Starlink e nas informações militares vindas dos EUA. Trump, pressionado pelas intercalares, aponta a Zelensky. É um ponto de não-retorno?
              </p>
              <p class="obs-teaser-body">
                “Se Trump mandasse nos Estados Unidos em 1939, <strong>acho que seria aliado de Hitler</strong>. E, ao lado do gueto de Varsóvia, Witkoff e Kushner teriam construído um complexo de hotéis de luxo.” As palavras, ditas por membro dos serviços secretos ucranianos a um jornalista da Economist...
              </p>
              <div class="obs-fade-overlay"></div>
            </div>

            <!-- Caixa de Paywall Oficial Observador -->
            <div class="obs-paywall-card">
              <span class="obs-paywall-sub">Assine o Observador para continuar a ler</span>
              <h3 class="obs-paywall-title">Já somos quase 50.000 assinantes.</h3>

              <!-- Seletor de Faturação -->
              <div class="obs-billing-toggle" role="tablist">
                <button id="btnObsBillingAnnual" class="obs-billing-btn active" role="tab" aria-selected="true">
                  Anual <span class="obs-pill-accent">Oferta 2 meses</span>
                </button>
                <button id="btnObsBillingMonthly" class="obs-billing-btn" role="tab" aria-selected="false">
                  Mensal
                </button>
              </div>

              <!-- Lista de Planos (Accordion) -->
              <div class="obs-plans-stack">
                
                <!-- Plano 1: Low Cost -->
                <div class="obs-plan-item" id="planItemLowCost">
                  <div class="obs-plan-header">
                    <label class="obs-radio-label">
                      <input type="radio" name="obsPlan" value="lowcost" />
                      <strong>Low Cost</strong>
                    </label>
                    <div class="obs-plan-price-block">
                      <del id="priceLowCostOld" class="obs-old-price">59,88€</del>
                      <strong id="priceLowCostNow" class="obs-now-price">29,90€ /ano</strong>
                      <span id="badgeLowCost" class="obs-discount-pill">50% DESCONTO</span>
                    </div>
                  </div>
                </div>

                <!-- Plano 2: Standard (Recomendado / Aberto) -->
                <div class="obs-plan-item is-expanded" id="planItemStandard">
                  <div class="obs-plan-header">
                    <label class="obs-radio-label">
                      <input type="radio" name="obsPlan" value="standard" checked />
                      <strong>Standard</strong>
                    </label>
                    <div class="obs-plan-price-block">
                      <del id="priceStdOld" class="obs-old-price">95,88€</del>
                      <strong id="priceStdNow" class="obs-now-price">49,90€ /ano</strong>
                      <span id="badgeStd" class="obs-discount-pill wine">HERDADE SÃO MIGUEL - 47% DESCONTO</span>
                    </div>
                  </div>
                  
                  <div class="obs-plan-body">
                    <ul class="obs-benefits-list">
                      <li><span class="obs-check">✓</span> Low Cost, mais:</li>
                      <li><span class="obs-check">✓</span> Acesso a artigos de Opinião</li>
                      <li><span class="obs-check">✓</span> Acesso antecipado Podcast+</li>
                      <li><span class="obs-check">✓</span> Menos publicidade</li>
                      <li><span class="obs-check">✓</span> Newsletter exclusiva dos bastidores</li>
                      <li><span class="obs-check">✓</span> Possibilidade de comentar artigos</li>
                      <li><span class="obs-check">✓</span> Ofereça 3 artigos a amigos</li>
                      <li><span class="obs-check">✓</span> Desconto na revista Aniversário (impressa)</li>
                    </ul>

                    <div id="obsWineIncentiveBox" class="obs-wine-box">
                      <strong>Assine e receba uma garrafa de vinho Herdade São Miguel Colheita Selecionada Tinto Magnum 2023.</strong>
                      <p>Exclusivo a planos anuais Standard e Premium. Os vencedores recebem 1 voucher para 1 visita guiada à adega na Casa Relvas. PVP total de oferta de 45,85€.</p>
                      <small>Termos &amp; condições | Herdade São Miguel | Maiores de 18 anos</small>
                    </div>
                  </div>
                </div>

                <!-- Plano 3: Premium -->
                <div class="obs-plan-item" id="planItemPremium">
                  <div class="obs-plan-header">
                    <label class="obs-radio-label">
                      <input type="radio" name="obsPlan" value="premium" />
                      <strong>Premium</strong>
                    </label>
                    <div class="obs-plan-price-block">
                      <del id="pricePremOld" class="obs-old-price">119,88€</del>
                      <strong id="pricePremNow" class="obs-now-price">79,90€ /ano</strong>
                      <span id="badgePrem" class="obs-discount-pill wine">HERDADE SÃO MIGUEL - 33% DESCONTO</span>
                    </div>
                  </div>
                </div>

              </div>

              <div class="obs-paywall-footer-action">
                <button class="obs-subscribe-primary-btn">ASSINAR COM DESCONTO</button>
              </div>
            </div>
          </div>

        </div>
      `;
      controlsHtml = `
        <button class="witness-ctrl-btn active" id="btnObsHome">Home: Grelha &amp; Destaques</button>
        <button class="witness-ctrl-btn" id="btnObsArticle">Artigo &amp; Áudio (Leitor)</button>
        <button class="witness-ctrl-btn" id="btnObsPaywall">Paywall Dinâmica (Subscrição)</button>
      `;
    }

    dom.detailWitnessCol.innerHTML = `
      <div class="witness-header">
        <h4 class="witness-title">ARTEFACTO</h4>
        <span class="witness-badge">${coord}</span>
      </div>
      <div class="witness-canvas">
        ${canvasHtml}
      </div>
      <div class="witness-controls-bar">
        ${controlsHtml}
      </div>
      <div class="witness-notes">
        <strong>NOTA TÉCNICA WCAG:</strong> ${witness.wcagNotes}
      </div>
    `;

    // Ligar Controlos Interativos do Nó 7
    attachWitnessEventListeners(coord);
  }

  // Interatividade nos Componentes-Testemunha
  function attachWitnessEventListeners(coord) {
    if (coord === 'L0.N7') {
      const grid = document.getElementById('swissGridSpecimen');
      const btnToggle = document.getElementById('btnToggleLines');

      btnToggle?.addEventListener('click', () => {
        grid.querySelectorAll('.swiss-grid-cell').forEach(c => {
          c.style.border = c.style.border === 'none' ? '1px dashed #A0A0A0' : 'none';
        });
      });
    } else if (coord === 'L1.N7') {
      const stripe = document.getElementById('guardianStripe');
      const kicker = document.getElementById('guardianKicker');
      const buttons = dom.detailWitnessCol.querySelectorAll('[data-pillar]');

      const colors = {
        news: '#C70000',
        opinion: '#E05E00',
        sport: '#0084C6',
        culture: '#A1845C',
        lifestyle: '#BB3B80'
      };

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const p = btn.dataset.pillar;
          stripe.style.backgroundColor = colors[p];
          kicker.style.color = colors[p];
          kicker.textContent = `${p.toUpperCase()} · PILAR EDITORIAL`;
        });
      });
    } else if (coord === 'L2.N7') {
      const btn = document.getElementById('btnToggleBbcTarget');
      const overlay = document.getElementById('bbcTouchOverlay');
      btn?.addEventListener('click', () => {
        overlay.classList.toggle('visible');
        btn.classList.toggle('active');
      });
    } else if (coord === 'L4.N7') {
      const card = document.getElementById('nytSpecimenCard');
      const btnLight = document.getElementById('btnNytLight');
      const btnDark = document.getElementById('btnNytDark');

      btnLight?.addEventListener('click', () => {
        card.className = 'nyt-card-specimen light-mode';
        btnLight.classList.add('active');
        btnDark.classList.remove('active');
      });
      btnDark?.addEventListener('click', () => {
        card.className = 'nyt-card-specimen dark-mode';
        btnDark.classList.add('active');
        btnLight.classList.remove('active');
      });
    } else if (coord === 'L5.N7') {
      const card = document.getElementById('newskitCard');
      const btnTimes = document.getElementById('btnThemeTimes');
      const btnSun = document.getElementById('btnThemeSun');
      const header = card?.querySelector('.chameleon-header');

      btnTimes?.addEventListener('click', () => {
        card.className = 'newskit-card-specimen theme-times';
        header.textContent = 'THE TIMES — COURT & POLITICS';
        btnTimes.classList.add('active');
        btnSun.classList.remove('active');
      });
      btnSun?.addEventListener('click', () => {
        card.className = 'newskit-card-specimen theme-sun';
        header.textContent = 'THE SUN — EXCLUSIVE BUST-UP!';
        btnSun.classList.add('active');
        btnTimes.classList.remove('active');
      });
    } else if (coord === 'L6.N7') {
      const badge = document.getElementById('ptAuditBadge');
      const meta = document.getElementById('ptMetaLine');
      const btnOrig = document.getElementById('btnAuditOriginal');
      const btnFixed = document.getElementById('btnAuditFixed');

      btnOrig?.addEventListener('click', () => {
        badge.className = 'audit-flag fail';
        badge.textContent = 'FALHA WCAG 1.4.3 (3.5:1)';
        meta.className = 'pt-meta-line meta-original';
        btnOrig.classList.add('active');
        btnFixed.classList.remove('active');
      });
      btnFixed?.addEventListener('click', () => {
        badge.className = 'audit-flag pass';
        badge.textContent = 'CUMPRE WCAG 1.4.3 (7.5:1 AAA)';
        meta.className = 'pt-meta-line meta-fixed';
        btnFixed.classList.add('active');
        btnOrig.classList.remove('active');
      });
    } else if (coord === 'L7.N7') {
      const homeView = document.getElementById('obsHomeView');
      const articleView = document.getElementById('obsArticleView');
      const paywallView = document.getElementById('obsPaywallView');

      const btnHome = document.getElementById('btnObsHome');
      const btnArticle = document.getElementById('btnObsArticle');
      const btnPaywall = document.getElementById('btnObsPaywall');

      // Alternador de Organismos Principais
      function switchObsView(activeView, activeBtn) {
        [homeView, articleView, paywallView].forEach(v => v?.classList.remove('is-active'));
        [btnHome, btnArticle, btnPaywall].forEach(b => b?.classList.remove('active'));
        activeView?.classList.add('is-active');
        activeBtn?.classList.add('active');
      }

      btnHome?.addEventListener('click', () => switchObsView(homeView, btnHome));
      btnArticle?.addEventListener('click', () => switchObsView(articleView, btnArticle));
      btnPaywall?.addEventListener('click', () => switchObsView(paywallView, btnPaywall));

      // Controlos de Áudio no Artigo
      const btnAudioPill = document.getElementById('btnAudioArticlePill');
      const inlinePlayer = document.getElementById('obsInlineAudioPlayer');
      const btnPlayAudio = document.getElementById('btnPlayArticleAudio');
      const lblAudioState = document.getElementById('lblAudioState');
      const playIcon = document.getElementById('obsPlayIcon');
      let isAudioPlaying = false;

      function toggleArticleAudio() {
        if (!inlinePlayer) return;
        if (inlinePlayer.style.display === 'none') {
          inlinePlayer.style.display = 'flex';
          isAudioPlaying = true;
        } else {
          isAudioPlaying = !isAudioPlaying;
        }

        if (isAudioPlaying) {
          if (playIcon) playIcon.textContent = '⏸';
          if (lblAudioState) lblAudioState.textContent = 'A reproduzir...';
          btnAudioPill?.classList.add('playing');
        } else {
          if (playIcon) playIcon.textContent = '▶';
          if (lblAudioState) lblAudioState.textContent = '6 min';
          btnAudioPill?.classList.remove('playing');
        }
      }

      btnAudioPill?.addEventListener('click', toggleArticleAudio);
      btnPlayAudio?.addEventListener('click', toggleArticleAudio);

      // Controlos da Paywall: Anual vs Mensal
      const btnBillingAnnual = document.getElementById('btnObsBillingAnnual');
      const btnBillingMonthly = document.getElementById('btnObsBillingMonthly');
      const priceLowCostOld = document.getElementById('priceLowCostOld');
      const priceLowCostNow = document.getElementById('priceLowCostNow');
      const priceStdOld = document.getElementById('priceStdOld');
      const priceStdNow = document.getElementById('priceStdNow');
      const pricePremOld = document.getElementById('pricePremOld');
      const pricePremNow = document.getElementById('pricePremNow');
      const wineBox = document.getElementById('obsWineIncentiveBox');
      const badgeStd = document.getElementById('badgeStd');
      const badgePrem = document.getElementById('badgePrem');

      btnBillingAnnual?.addEventListener('click', () => {
        btnBillingAnnual.classList.add('active');
        btnBillingAnnual.setAttribute('aria-selected', 'true');
        btnBillingMonthly?.classList.remove('active');
        btnBillingMonthly?.setAttribute('aria-selected', 'false');

        if (priceLowCostOld) priceLowCostOld.textContent = '59,88€';
        if (priceLowCostNow) priceLowCostNow.textContent = '29,90€ /ano';
        if (priceStdOld) priceStdOld.textContent = '95,88€';
        if (priceStdNow) priceStdNow.textContent = '49,90€ /ano';
        if (pricePremOld) pricePremOld.textContent = '119,88€';
        if (pricePremNow) pricePremNow.textContent = '79,90€ /ano';

        if (badgeStd) badgeStd.textContent = 'HERDADE SÃO MIGUEL - 47% DESCONTO';
        if (badgePrem) badgePrem.textContent = 'HERDADE SÃO MIGUEL - 33% DESCONTO';
        if (wineBox) wineBox.style.display = 'block';
      });

      btnBillingMonthly?.addEventListener('click', () => {
        btnBillingMonthly.classList.add('active');
        btnBillingMonthly.setAttribute('aria-selected', 'true');
        btnBillingAnnual?.classList.remove('active');
        btnBillingAnnual?.setAttribute('aria-selected', 'false');

        if (priceLowCostOld) priceLowCostOld.textContent = '';
        if (priceLowCostNow) priceLowCostNow.textContent = '4,99€ /mês';
        if (priceStdOld) priceStdOld.textContent = '';
        if (priceStdNow) priceStdNow.textContent = '7,99€ /mês';
        if (pricePremOld) pricePremOld.textContent = '';
        if (pricePremNow) pricePremNow.textContent = '9,99€ /mês';

        if (badgeStd) badgeStd.textContent = 'SEM COMPROMISSO';
        if (badgePrem) badgePrem.textContent = 'SEM COMPROMISSO';
        if (wineBox) wineBox.style.display = 'none';
      });

      // Seleção e expansão de planos (Accordion)
      const planItems = [
        document.getElementById('planItemLowCost'),
        document.getElementById('planItemStandard'),
        document.getElementById('planItemPremium')
      ];

      planItems.forEach(item => {
        item?.querySelector('.obs-plan-header')?.addEventListener('click', () => {
          planItems.forEach(pi => {
            pi?.classList.remove('is-expanded');
            const radio = pi?.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
          });
          item.classList.add('is-expanded');
          const myRadio = item.querySelector('input[type="radio"]');
          if (myRadio) myRadio.checked = true;
        });
      });
    }
  }

  // ==========================================================================
  // NAVEGAÇÃO ENTRE NÓS ADJACENTES NO PLANO DE NÓ
  // ==========================================================================
  function updateAdjacencyButtons(coord) {
    const parts = coord.split('.');
    const curRowId = parts[0];
    const curColId = parts[1];

    const rIdx = rowIds.indexOf(curRowId);
    const cIdx = colIds.indexOf(curColId);

    // Nó Anterior (Esquerda - Mesma Linha)
    if (cIdx > 0) {
      dom.btnPrevNode.disabled = false;
      const prevCoord = `${curRowId}.${colIds[cIdx - 1]}`;
      const data = getNodeData(prevCoord);
      dom.prevNodeName.textContent = data ? `${data.column.id} · ${data.column.name}` : 'Início da Linha';
      dom.btnPrevNode.onclick = () => {
        setSelectedCell(rIdx, cIdx, false);
        openNodeDetail(prevCoord);
      };
    } else {
      dom.btnPrevNode.disabled = true;
      dom.prevNodeName.textContent = 'Início da Linha';
    }

    // Nó Seguinte (Direita - Mesma Linha)
    if (cIdx < colIds.length - 1) {
      dom.btnNextNode.disabled = false;
      const nextCoord = `${curRowId}.${colIds[cIdx + 1]}`;
      const data = getNodeData(nextCoord);
      dom.nextNodeName.textContent = data ? `${data.column.id} · ${data.column.name}` : 'Fim da Linha';
      dom.btnNextNode.onclick = () => {
        setSelectedCell(rIdx, cIdx + 2, false);
        openNodeDetail(nextCoord);
      };
    } else {
      dom.btnNextNode.disabled = true;
      dom.nextNodeName.textContent = 'Fim da Linha';
    }

    // Caso Superior (Cima - Mesma Coluna)
    if (rIdx > 0) {
      dom.btnUpNode.disabled = false;
      const upCoord = `${rowIds[rIdx - 1]}.${curColId}`;
      const data = getNodeData(upCoord);
      dom.upNodeName.textContent = data ? `${data.row.rowId} · ${data.row.entity}` : 'Limite Superior';
      dom.btnUpNode.onclick = () => {
        setSelectedCell(rIdx - 1, cIdx + 1, false);
        openNodeDetail(upCoord);
      };
    } else {
      dom.btnUpNode.disabled = true;
      dom.upNodeName.textContent = 'Limite Superior';
    }

    // Caso Inferior (Baixo - Mesma Coluna)
    if (rIdx < rowIds.length - 1) {
      dom.btnDownNode.disabled = false;
      const downCoord = `${rowIds[rIdx + 1]}.${curColId}`;
      const data = getNodeData(downCoord);
      dom.downNodeName.textContent = data ? `${data.row.rowId} · ${data.row.entity}` : 'Limite Inferior';
      dom.btnDownNode.onclick = () => {
        setSelectedCell(rIdx + 1, cIdx + 1, false);
        openNodeDetail(downCoord);
      };
    } else {
      dom.btnDownNode.disabled = true;
      dom.downNodeName.textContent = 'Limite Inferior';
    }
  }

  // ==========================================================================
  // CONTROLO TOTAL POR TECLADO (ACESSIBILIDADE WCAG 2.2)
  // ==========================================================================
  function handleGlobalKeyDown(e) {
    // Se o modal de guia de utilização estiver aberto
    if (state.isGuideOpen) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        closeGuideModal();
      }
      return;
    }

    // Se o modal de nó estiver aberto (Plano 2)
    if (state.isDetailOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeNodeDetail();
      } else if (e.key === 'ArrowLeft' && !dom.btnPrevNode.disabled) {
        if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
          e.preventDefault();
          dom.btnPrevNode.click();
        }
      } else if (e.key === 'ArrowRight' && !dom.btnNextNode.disabled) {
        if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
          e.preventDefault();
          dom.btnNextNode.click();
        }
      } else if (e.key === 'ArrowUp' && !dom.btnUpNode.disabled) {
        if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
          e.preventDefault();
          dom.btnUpNode.click();
        }
      } else if (e.key === 'ArrowDown' && !dom.btnDownNode.disabled) {
        if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
          e.preventDefault();
          dom.btnDownNode.click();
        }
      }
      return;
    }

    // Se estivermos na View Principal (Plano 1)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
      if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) !== -1) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCell(state.selectedRow - 1, state.selectedCol, true);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCell(state.selectedRow + 1, state.selectedCol, true);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedCell(state.selectedRow, state.selectedCol - 1, true);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedCell(state.selectedRow, state.selectedCol + 1, true);
          break;
        case 'Enter':
          e.preventDefault();
          const coord = `${rowIds[state.selectedRow]}.${colIds[state.selectedCol - 1]}`;
          openNodeDetail(coord);
          break;
      }
    }
  }

  // ==========================================================================
  // GUIA DE UTILIZAÇÃO E ONBOARDING (ACESSIBILIDADE DIRETA RATO & TECLADO)
  // ==========================================================================
  function openGuideModal() {
    state.isGuideOpen = true;
    dom.welcomeModal?.classList.add('is-active');
    dom.welcomeModal?.setAttribute('aria-hidden', 'false');
    dom.btnStartExploring?.focus();
  }

  function closeGuideModal() {
    state.isGuideOpen = false;
    if (dom.chkDoNotShowGuideAgain?.checked) {
      localStorage.setItem('matrix_guide_dismissed', 'true');
    }
    dom.welcomeModal?.classList.remove('is-active');
    dom.welcomeModal?.setAttribute('aria-hidden', 'true');
  }

  function initGuideModal() {
    // Disparadores Manuais
    dom.btnOpenGuide?.addEventListener('click', openGuideModal);
    dom.btnStatusBarGuide?.addEventListener('click', openGuideModal);

    // Disparadores de Fecho
    dom.btnCloseGuideModal?.addEventListener('click', closeGuideModal);
    dom.btnStartExploring?.addEventListener('click', closeGuideModal);

    // Fechar ao clicar no fundo escurecido
    dom.welcomeModal?.addEventListener('click', (e) => {
      if (e.target === dom.welcomeModal) {
        closeGuideModal();
      }
    });

    // Abertura automática na primeira visita (a não ser que o utilizador tenha marcado a caixa)
    const isDismissed = localStorage.getItem('matrix_guide_dismissed') === 'true';
    if (!isDismissed) {
      // Pequeno timeout suave para garantir renderização do DOM
      setTimeout(openGuideModal, 300);
    }
  }

  function initTheme() {
    const btnToggleTheme = document.getElementById('btnToggleTheme');
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        localStorage.setItem('matrix_v1_theme', 'dark');
        if (btnToggleTheme) btnToggleTheme.innerHTML = '☼ CLARO';
      } else {
        document.body.classList.remove('theme-dark');
        localStorage.setItem('matrix_v1_theme', 'light');
        if (btnToggleTheme) btnToggleTheme.innerHTML = '◐ TEMA';
      }
    }
    btnToggleTheme?.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
    const saved = localStorage.getItem('matrix_v1_theme');
    if (saved === 'dark') {
      applyTheme('dark');
    }
  }

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  function init() {
    initTheme();
    renderMatrix();

    // Eventos de clique do Modal de Nó
    dom.closeDetailBtn.addEventListener('click', closeNodeDetail);

    // Fechar ao clicar fora do painel
    dom.detailView.addEventListener('click', (e) => {
      if (e.target === dom.detailView) {
        closeNodeDetail();
      }
    });

    // Eventos de Teclado Global
    window.addEventListener('keydown', handleGlobalKeyDown);

    // Inicialização do Modal de Guia Onboarding
    initGuideModal();

    console.log('Aplicação Matriz Genealógica de Design Systems inicializada.');
  }

  // Executar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
