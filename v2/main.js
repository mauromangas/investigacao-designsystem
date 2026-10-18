/**
 * ============================================================================
 * MATRIZ EDITORIAL V2.0 — O TEAR EDITORIAL / SPLIT-BENCH CARTOGRÁFICO
 * Controlador de Interface Suíça de Alta Densidade (Karl Gerstner / Muriel Cooper)
 * ============================================================================
 */

(function () {
  'use strict';

  const DATA = window.MATRIX_DATA;
  if (!DATA) {
    console.error('Erro crítico: MATRIX_DATA não foi encontrado em window.');
    return;
  }

  // Constantes de Mapeamento
  const ROW_IDS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
  const COL_IDS = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'];

  // Estado da Aplicação v2
  const state = {
    rowIndex: 0,        // 0..7 (L0..L7)
    colIndex: 0,        // 0..6 (N1..N7)
    activeCoord: 'L0.N1',
    isBenchOpen: false,
    pinnedCoords: [],   // Array de nós fixados para Comparação Múltipla (Tecla C)
    isLineageActive: false,
    currentTheme: 'paper-light', // 'paper-light' | 'paper-dark' | 'high-contrast'
    readingScale: 1.0,
    witnessState: {
      // Estado do artefacto do Observador (L7.N7)
      obsView: 'home',       // 'home' | 'article' | 'paywall'
      obsBilling: 'annual',  // 'annual' | 'monthly'
      obsAudioPlaying: false,
      // Estado de outros artefactos
      swissRatio: '3x4',
      swissShowLines: true,
      guardianPillar: 'news',
      bbcTouchVisible: false,
      ftChartIndex: 0,
      nytTheme: 'light',
      newskitBrand: 'times',
      ptAuditFixed: false
    }
  };

  // Referências DOM
  const dom = {
    body: document.body,
    workspace: document.getElementById('v2WorkspaceBench'),
    benchLeft: document.getElementById('v2BenchLeft'),
    benchRight: document.getElementById('v2BenchRight'),
    gridViewport: document.getElementById('v2GridViewport'),
    matrixTable: document.getElementById('v2MatrixTable'),
    crosshairSvg: document.getElementById('crosshairSvg'),
    crosshairH: document.getElementById('crosshairH'),
    crosshairV: document.getElementById('crosshairV'),
    lineageSvg: document.getElementById('lineageSvg'),
    lineagePathsGroup: document.getElementById('lineagePathsGroup'),
    lineageTooltip: document.getElementById('lineageTooltip'),
    lineageTooltipHead: document.getElementById('lineageTooltipHead'),
    lineageTooltipBody: document.getElementById('lineageTooltipBody'),
    telemetry: document.getElementById('v2Telemetry'),
    
    // Ferramentas do Cabeçalho
    btnToggleLineage: document.getElementById('btnToggleLineage'),
    btnToggleTheme: document.getElementById('btnToggleTheme'),
    btnOpenHelpV2: document.getElementById('btnOpenHelpV2'),
    v2HelpModal: document.getElementById('v2HelpModal'),
    btnCloseHelpModal: document.getElementById('btnCloseHelpModal'),
    btnDismissHelp: document.getElementById('btnDismissHelp'),

    // Elementos da Bancada de Dissecação
    benchScrollBody: document.getElementById('benchScrollBody'),
    benchActiveCoordTag: document.getElementById('benchActiveCoordTag'),
    benchActiveEntityTag: document.getElementById('benchActiveEntityTag'),
    btnPinNode: document.getElementById('btnPinNode'),
    lblPinAction: document.getElementById('lblPinAction'),
    btnCloseBench: document.getElementById('btnCloseBench'),
    benchPinnedSection: document.getElementById('benchPinnedSection'),
    pinnedCountBadge: document.getElementById('pinnedCountBadge'),
    btnUnpinAllNodes: document.getElementById('btnUnpinAllNodes'),
    pinnedNodesGrid: document.getElementById('pinnedNodesGrid'),
    benchActiveSection: document.getElementById('benchActiveSection'),
    benchTagsRow: document.getElementById('benchTagsRow'),
    benchNodeTitle: document.getElementById('benchNodeTitle'),
    benchNodeSub: document.getElementById('benchNodeSub'),
    benchProseContent: document.getElementById('benchProseContent'),
    benchGenealogyLinks: document.getElementById('benchGenealogyLinks'),
    benchSpecimenCol: document.getElementById('benchSpecimenCol'),
    specimenBadgeCoord: document.getElementById('specimenBadgeCoord'),
    benchSpecimenCanvas: document.getElementById('benchSpecimenCanvas'),
    benchSpecimenControls: document.getElementById('benchSpecimenControls'),
    benchWcagNotice: document.getElementById('benchWcagNotice'),
    
    // Navegação Quadrilateral na Bancada
    btnBenchUp: document.getElementById('btnBenchUp'),
    btnBenchDown: document.getElementById('btnBenchDown'),
    btnBenchPrev: document.getElementById('btnBenchPrev'),
    btnBenchNext: document.getElementById('btnBenchNext'),
    lblBenchUp: document.getElementById('lblBenchUp'),
    lblBenchDown: document.getElementById('lblBenchDown'),
    lblBenchPrev: document.getElementById('lblBenchPrev'),
    lblBenchNext: document.getElementById('lblBenchNext'),

    // Elementos Mobile & Bottom Sheets
    v2MobileBar: document.getElementById('v2MobileBar'),
    btnMobileSheetAxes: document.getElementById('btnMobileSheetAxes'),
    btnMobileSheetA11y: document.getElementById('btnMobileSheetA11y'),
    btnMobileCompareToggle: document.getElementById('btnMobileCompareToggle'),
    btnMobileCloseNode: document.getElementById('btnMobileCloseNode'),
    v2SheetAxes: document.getElementById('v2SheetAxes'),
    v2SheetA11y: document.getElementById('v2SheetA11y'),
    sheetCasesButtons: document.getElementById('sheetCasesButtons'),
    sheetColsButtons: document.getElementById('sheetColsButtons'),
    btnThemeMineralLight: document.getElementById('btnThemeMineralLight'),
    btnThemeMineralDark: document.getElementById('btnThemeMineralDark'),
    btnThemeHighContrast: document.getElementById('btnThemeHighContrast')
  };

  // ==========================================================================
  // HELPERS DE CONSULTA DE DADOS
  // ==========================================================================
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

  function getCoord(rIdx, cIdx) {
    return `${ROW_IDS[rIdx]}.${COL_IDS[cIdx]}`;
  }

  function getIndicesFromCoord(coord) {
    const [rId, cId] = coord.split('.');
    return {
      rIdx: ROW_IDS.indexOf(rId),
      cIdx: COL_IDS.indexOf(cId)
    };
  }




  // ==========================================================================
  // 3. RENDERIZAÇÃO DA MATRIZ CARTOGRÁFICA
  // ==========================================================================
  function renderMatrix() {
    dom.matrixTable.innerHTML = '';

    // Canto Superior Esquerdo
    const corner = document.createElement('div');
    corner.className = 'v2-matrix-corner';
    corner.innerHTML = `
      <span class="corner-axis-tag">MATRIZ 8×7</span>
      <span class="corner-label-text">CASOS / DIMENSÕES</span>
    `;
    dom.matrixTable.appendChild(corner);

    // Cabeçalhos das Colunas
    DATA.columns.forEach((col, cIdx) => {
      const colHeader = document.createElement('div');
      colHeader.className = `v2-col-header ${cIdx < 2 ? 'col-predigital' : 'col-digital'}`;
      colHeader.dataset.colIndex = cIdx;
      colHeader.innerHTML = `
        <div class="col-header-badge">
          <span class="badge-col-code">${col.id}</span>
          <span class="badge-col-phase">${col.phase}</span>
        </div>
        <div class="col-header-titles">
          <h3 class="col-main-name">${col.name}</h3>
          <p class="col-sub-caption">${col.subtitle}</p>
        </div>
      `;
      colHeader.addEventListener('click', () => {
        setFocusedCell(state.rowIndex, cIdx);
      });
      dom.matrixTable.appendChild(colHeader);
    });

    // Linhas da Matriz
    DATA.rows.forEach((row, rIdx) => {
      // Cabeçalho da Linha (Esquerda Sticky)
      const rowHeader = document.createElement('div');
      rowHeader.className = `v2-row-header ${rIdx === 7 ? 'row-born-digital' : ''}`;
      rowHeader.dataset.rowIndex = rIdx;
      rowHeader.innerHTML = `
        <div class="row-header-code-line">
          <span class="row-code-pill">${row.rowId}</span>
          <span class="row-period-txt">${row.period}</span>
        </div>
        <h4 class="row-entity-title">${row.entity}</h4>
        <div class="row-system-name">${row.systemName}</div>
      `;
      rowHeader.addEventListener('click', () => {
        setFocusedCell(rIdx, state.colIndex);
      });
      dom.matrixTable.appendChild(rowHeader);

      // Células da Linha (N1..N7)
      COL_IDS.forEach((colId, cIdx) => {
        const coord = `${row.rowId}.${colId}`;
        const nodeInfo = row.nodes[colId];
        const cell = document.createElement('div');
        cell.className = 'v2-matrix-cell';
        cell.id = `cell-${coord.replace('.', '-')}`;
        cell.dataset.coord = coord;
        cell.dataset.rowIndex = rIdx;
        cell.dataset.colIndex = cIdx;
        cell.tabIndex = 0;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `${coord} - ${row.entity}: ${nodeInfo ? nodeInfo.title : 'Sem dados'}`);

        if (nodeInfo) {
          const isWitness = colId === 'N7';
          const shortTitle = nodeInfo.title;
          const excerpt = nodeInfo.content.slice(0, 85) + '...';

          cell.innerHTML = `
            <div class="node-cell-header">
              <span class="node-cell-coord">${coord}</span>
              ${isWitness ? '<span class="node-witness-badge">ARTEFACTO</span>' : ''}
            </div>
            <h5 class="node-cell-title">${shortTitle}</h5>
            <p class="node-cell-excerpt">${excerpt}</p>
            <div class="node-cell-bottom">
              <span class="node-cell-tag">${nodeInfo.tags ? nodeInfo.tags[0] : ''}</span>
              <span class="node-cell-enter-hint">ENTER ↵</span>
            </div>
          `;

          // Eventos de clique e foco
          cell.addEventListener('mouseenter', () => {
            setFocusedCell(rIdx, cIdx, false);
          });

          cell.addEventListener('click', () => {
            setFocusedCell(rIdx, cIdx);
            openBench(coord);
          });

          cell.addEventListener('focus', () => {
            setFocusedCell(rIdx, cIdx, false);
          });
        }

        dom.matrixTable.appendChild(cell);
      });
    });
  }

  // ==========================================================================
  // 4. ATUALIZAÇÃO DO NÓ FOCADO & MIRA CARTOGRÁFICA (CROSSHAIRS)
  // ==========================================================================
  function setFocusedCell(rIdx, cIdx, scrollIntoView = true) {
    if (rIdx < 0) rIdx = 0;
    if (rIdx >= ROW_IDS.length) rIdx = ROW_IDS.length - 1;
    if (cIdx < 0) cIdx = 0;
    if (cIdx >= COL_IDS.length) cIdx = COL_IDS.length - 1;

    state.rowIndex = rIdx;
    state.colIndex = cIdx;
    const coord = getCoord(rIdx, cIdx);
    state.activeCoord = coord;

    const dataObj = getNodeData(coord);
    if (!dataObj) return;

    // 1. Atualizar Telemetria no Topo
    dom.telemetry.textContent = `[ COORD: ${coord} | ENTIDADE: ${dataObj.row.entity.toUpperCase()} | EIXO: ${dataObj.column.name.toUpperCase()} ]`;

    // 2. Destacar Célula na Matriz
    document.querySelectorAll('.v2-matrix-cell.selected').forEach(el => el.classList.remove('selected'));
    const cellEl = document.getElementById(`cell-${coord.replace('.', '-')}`);
    if (cellEl) {
      cellEl.classList.add('selected');
      if (scrollIntoView && !state.isBenchOpen) {
        // Assegura visibilidade suave dentro do contentor
        cellEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }

    // 3. Destacar Linha e Coluna na Matriz
    document.querySelectorAll('.v2-row-header.row-highlighted').forEach(el => el.classList.remove('row-highlighted'));
    document.querySelectorAll('.v2-col-header.col-highlighted').forEach(el => el.classList.remove('col-highlighted'));
    const rowEl = document.querySelector(`.v2-row-header[data-row-index="${rIdx}"]`);
    const colEl = document.querySelector(`.v2-col-header[data-col-index="${cIdx}"]`);
    if (rowEl) rowEl.classList.add('row-highlighted');
    if (colEl) colEl.classList.add('col-highlighted');


    // 6. Atualizar Mira Cartográfica (Crosshairs)
    updateCrosshairs(cellEl);

    // 7. Se a bancada estiver aberta, atualizar o conteúdo imediatamente
    if (state.isBenchOpen) {
      updateBenchContent(coord);
    }
  }

  function updateCrosshairs(cellEl) {
    if (!cellEl || !dom.gridViewport) return;

    // Obter retângulo da célula relativo ao scroll viewport da matriz
    const vpRect = dom.gridViewport.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();

    const scrollLeft = dom.gridViewport.scrollLeft;
    const scrollTop = dom.gridViewport.scrollTop;

    const centerX = (cellRect.left - vpRect.left) + scrollLeft + (cellRect.width / 2);
    const centerY = (cellRect.top - vpRect.top) + scrollTop + (cellRect.height / 2);

    dom.crosshairH.setAttribute('y1', centerY);
    dom.crosshairH.setAttribute('y2', centerY);
    dom.crosshairH.setAttribute('x1', 0);
    dom.crosshairH.setAttribute('x2', dom.matrixTable.scrollWidth || '100%');

    dom.crosshairV.setAttribute('x1', centerX);
    dom.crosshairV.setAttribute('x2', centerX);
    dom.crosshairV.setAttribute('y1', 0);
    dom.crosshairV.setAttribute('y2', dom.matrixTable.scrollHeight || '100%');
  }

  // ==========================================================================
  // 5. SPLIT-BENCH ZUI: ABERTURA, ATUALIZAÇÃO E FECHO
  // ==========================================================================
  function openBench(coord) {
    const dataObj = getNodeData(coord);
    if (!dataObj) return;

    state.isBenchOpen = true;
    dom.workspace.classList.remove('state-panoramic');
    dom.workspace.classList.add('state-split');
    dom.benchRight.setAttribute('aria-hidden', 'false');

    updateBenchContent(coord);

    // Se estiver no mobile, fazer scroll até à bancada
    if (window.innerWidth < 768) {
      dom.benchRight.scrollIntoView({ behavior: 'smooth' });
    }

    // Reposicionar mirais após divisão mecânica
    setTimeout(() => {
      const cellEl = document.getElementById(`cell-${coord.replace('.', '-')}`);
      updateCrosshairs(cellEl);
      if (state.isLineageActive) {
        renderLineagePaths();
      }
    }, 380);
  }

  function closeBench() {
    state.isBenchOpen = false;
    dom.workspace.classList.remove('state-split');
    dom.workspace.classList.add('state-panoramic');
    dom.benchRight.setAttribute('aria-hidden', 'true');

    // Reposicionar mira
    setTimeout(() => {
      const cellEl = document.getElementById(`cell-${state.activeCoord.replace('.', '-')}`);
      updateCrosshairs(cellEl);
      if (state.isLineageActive) {
        renderLineagePaths();
      }
    }, 380);
  }

  function updateBenchContent(coord) {
    const dataObj = getNodeData(coord);
    if (!dataObj) return;

    const { node, row, column } = dataObj;

    // Header da Bancada
    dom.benchActiveCoordTag.textContent = coord;
    dom.benchActiveEntityTag.textContent = `${row.entity.toUpperCase()} · ${column.name.toUpperCase()}`;

    // Tags
    dom.benchTagsRow.innerHTML = '';
    const allTags = [column.phase, row.period, ...(node.tags || [])];
    allTags.forEach(t => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'bench-tag-pill';
      tagSpan.textContent = t;
      dom.benchTagsRow.appendChild(tagSpan);
    });

    // Manchete e Subtítulo
    dom.benchNodeTitle.textContent = node.title;
    dom.benchNodeSub.textContent = `Sistema: ${row.systemName} · Arquétipo: ${row.archetype}`;

    // Prosa de Leitura Crítica
    dom.benchProseContent.innerHTML = `<p>${node.content}</p>`;

    // Genealogia e Linhagem Direta
    renderGenealogyLinks(coord);

    // Componente-Testemunha (Raio-X Interativo)
    renderBenchSpecimen(coord, dataObj);

    // Atualizar Botões de Navegação Quadrilateral
    updateQuadNav(coord);

    // Atualizar secção de nós fixados para comparação
    renderPinnedSection();

    // Scroll para o topo da bancada
    dom.benchScrollBody.scrollTop = 0;
  }

  function renderGenealogyLinks(coord) {
    dom.benchGenealogyLinks.innerHTML = '';
    const crossRefs = DATA.crossReferences.filter(cr => cr.from === coord || cr.to === coord);

    if (crossRefs.length === 0) {
      dom.benchGenealogyLinks.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); padding: 0.5rem 0;">
          Não existem ramificações genealógicas diretas assinaladas para este nó.
        </div>
      `;
      return;
    }

    crossRefs.forEach(cr => {
      const isSource = cr.from === coord;
      const targetCoord = isSource ? cr.to : cr.from;
      const targetData = getNodeData(targetCoord);
      const card = document.createElement('div');
      card.className = 'genealogy-card';
      card.style.cssText = 'background-color: var(--surface-paper-elevated); border: 1px solid var(--border-hairline); border-left: 3px solid var(--editorial-news); padding: 0.65rem 0.85rem; margin-top: 0.5rem; cursor: pointer;';
      card.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; color: var(--editorial-news); margin-bottom: 2px;">
          ${isSource ? `ORIGEM ➔ DESTINO [${cr.to}]` : `INFLUÊNCIA DE [${cr.from}]`}
        </div>
        <div style="font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--ink-primary); margin-bottom: 4px;">
          ${targetData ? `${targetData.row.entity}: ${targetData.node.title}` : targetCoord}
        </div>
        <p style="font-family: var(--font-serif); font-size: 11.5px; line-height: 1.4; color: var(--ink-secondary); margin: 0;">
          ${cr.relation}
        </p>
      `;
      card.addEventListener('click', () => {
        const { rIdx, cIdx } = getIndicesFromCoord(targetCoord);
        setFocusedCell(rIdx, cIdx);
        openBench(targetCoord);
      });
      dom.benchGenealogyLinks.appendChild(card);
    });
  }

  function updateQuadNav(coord) {
    const { rIdx, cIdx } = getIndicesFromCoord(coord);

    // Cima (rIdx - 1)
    if (rIdx > 0) {
      const upCoord = getCoord(rIdx - 1, cIdx);
      const upData = getNodeData(upCoord);
      dom.lblBenchUp.textContent = `↑ ${upData.row.entity}`;
      dom.btnBenchUp.disabled = false;
      dom.btnBenchUp.onclick = () => { setFocusedCell(rIdx - 1, cIdx); openBench(upCoord); };
    } else {
      dom.lblBenchUp.textContent = '↑ TOPO';
      dom.btnBenchUp.disabled = true;
    }

    // Baixo (rIdx + 1)
    if (rIdx < ROW_IDS.length - 1) {
      const downCoord = getCoord(rIdx + 1, cIdx);
      const downData = getNodeData(downCoord);
      dom.lblBenchDown.textContent = `↓ ${downData.row.entity}`;
      dom.btnBenchDown.disabled = false;
      dom.btnBenchDown.onclick = () => { setFocusedCell(rIdx + 1, cIdx); openBench(downCoord); };
    } else {
      dom.lblBenchDown.textContent = '↓ BASE';
      dom.btnBenchDown.disabled = true;
    }

    // Esquerda (cIdx - 1)
    if (cIdx > 0) {
      const prevCoord = getCoord(rIdx, cIdx - 1);
      const prevData = getNodeData(prevCoord);
      dom.lblBenchPrev.textContent = `← ${prevData.column.id} ${prevData.column.name}`;
      dom.btnBenchPrev.disabled = false;
      dom.btnBenchPrev.onclick = () => { setFocusedCell(rIdx, cIdx - 1); openBench(prevCoord); };
    } else {
      dom.lblBenchPrev.textContent = '← N1';
      dom.btnBenchPrev.disabled = true;
    }

    // Direita (cIdx + 1)
    if (cIdx < COL_IDS.length - 1) {
      const nextCoord = getCoord(rIdx, cIdx + 1);
      const nextData = getNodeData(nextCoord);
      dom.lblBenchNext.textContent = `→ ${nextData.column.id} ${nextData.column.name}`;
      dom.btnBenchNext.disabled = false;
      dom.btnBenchNext.onclick = () => { setFocusedCell(rIdx, cIdx + 1); openBench(nextCoord); };
    } else {
      dom.lblBenchNext.textContent = '→ N7';
      dom.btnBenchNext.disabled = true;
    }
  }

  // ==========================================================================
  // 6. RENDERIZAÇÃO DOS COMPONENTES-TESTEMUNHA (NÓ 7 & ESPECÍMENES)
  // ==========================================================================
  function renderBenchSpecimen(coord, dataObj) {
    const isCol7 = coord.endsWith('.N7');
    dom.specimenBadgeCoord.textContent = coord;

    if (!isCol7) {
      // Se não for da coluna N7, exibe um painel de telemetria analítica
      dom.benchSpecimenCanvas.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--ink-secondary);">
          <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--editorial-news); margin-bottom: 0.5rem;">
            ANÁLISE DE DIMENSÃO SISTÉMICA
          </div>
          <h4 style="font-family: var(--font-display); font-size: 15px; margin-bottom: 0.5rem;">
            ${dataObj.column.name}: ${dataObj.column.subtitle}
          </h4>
          <p style="font-family: var(--font-serif); font-size: 12.5px; line-height: 1.5; max-width: 380px; margin: 0 auto 1rem;">
            Os Componentes-Testemunha com prototipagem interativa estão alojados na coluna N7 (Anatomia e Output Visual).
          </p>
          <button id="btnJumpToN7" class="v2-bench-btn" style="background-color: var(--editorial-news); color: #FFF; border: none; padding: 6px 14px;">
            VER COMPONENTE-TESTEMUNHA DESTA ENTIDADE (N7) ➔
          </button>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = '';
      dom.benchWcagNotice.innerHTML = `
        <strong>Enquadramento Normativo:</strong> Este nó contribui para a conformidade sistémica com a Diretiva UE 2019/882 e WCAG 2.2 através da documentação de regras editoriais reutilizáveis.
      `;

      const jumpBtn = document.getElementById('btnJumpToN7');
      if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
          const n7Coord = `${ROW_IDS[state.rowIndex]}.N7`;
          setFocusedCell(state.rowIndex, 6);
          openBench(n7Coord);
        });
      }
      return;
    }

    // Renderização dos Protótipos N7
    if (coord === 'L0.N7') {
      // Escola Suíça: Grelhas Modulares
      dom.benchSpecimenCanvas.innerHTML = `
        <div id="swissGridSpecimen" class="swiss-specimen-grid ratio-${state.witnessState.swissRatio} ${state.witnessState.swissShowLines ? '' : 'hide-lines'}">
          <div class="swiss-grid-cell highlight-black">M1</div>
          <div class="swiss-grid-cell highlight-red span-2">M2 / M3 TITULO</div>
          <div class="swiss-grid-cell">M4</div>
          <div class="swiss-grid-cell">M5</div>
          <div class="swiss-grid-cell">M6</div>
          <div class="swiss-grid-cell span-2">M7 / M8 TEXTO</div>
          <div class="swiss-grid-cell">M9</div>
          <div class="swiss-grid-cell">M10</div>
          <div class="swiss-grid-cell">M11</div>
          <div class="swiss-grid-cell">M12</div>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn ${state.witnessState.swissRatio === '3x4' ? 'active' : ''}" id="btnSwiss3x4">Proporção 3×4</button>
        <button class="witness-ctrl-btn ${state.witnessState.swissRatio === '4x6' ? 'active' : ''}" id="btnSwiss4x6">Proporção 4×6</button>
        <button class="witness-ctrl-btn" id="btnSwissLines">Alternar Linhas Visíveis</button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>WCAG 2.2 (1.4.10 Reflow):</strong> A grelha matemática suíça estabelece o princípio do layout proporcional sem scroll horizontal não intencional em ecrãs verticais.
      `;

      document.getElementById('btnSwiss3x4').onclick = () => {
        state.witnessState.swissRatio = '3x4';
        renderBenchSpecimen(coord, dataObj);
      };
      document.getElementById('btnSwiss4x6').onclick = () => {
        state.witnessState.swissRatio = '4x6';
        renderBenchSpecimen(coord, dataObj);
      };
      document.getElementById('btnSwissLines').onclick = () => {
        state.witnessState.swissShowLines = !state.witnessState.swissShowLines;
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L1.N7') {
      // The Guardian: Pilares Editoriais
      const pillars = {
        news: { name: 'News', color: 'var(--editorial-news)' },
        opinion: { name: 'Opinion', color: 'var(--editorial-opinion)' },
        sport: { name: 'Sport', color: '#0084C6' },
        culture: { name: 'Culture', color: 'var(--editorial-culture)' },
        lifestyle: { name: 'Lifestyle', color: '#BB3B80' }
      };
      const activePillar = pillars[state.witnessState.guardianPillar] || pillars.news;

      dom.benchSpecimenCanvas.innerHTML = `
        <div class="guardian-card-specimen">
          <div class="guardian-pillar-stripe" style="background-color: ${activePillar.color};"></div>
          <div class="guardian-card-inner">
            <span class="guardian-kicker" style="color: ${activePillar.color};">${activePillar.name.toUpperCase()} · INVESTIGAÇÃO</span>
            <h4 class="guardian-headline">The Guardian Source: Engenharia de Theming em 5 Pilares</h4>
            <p class="guardian-trail">O motor de tokens semânticos permite que o mesmo componente adapte filetes e cabeçalhos em função da secção editorial sem duplicação de CSS.</p>
          </div>
        </div>
      `;

      let ctrls = '';
      Object.keys(pillars).forEach(pKey => {
        ctrls += `<button class="witness-ctrl-btn ${state.witnessState.guardianPillar === pKey ? 'active' : ''}" data-pillar="${pKey}">${pillars[pKey].name}</button> `;
      });
      dom.benchSpecimenControls.innerHTML = ctrls;
      dom.benchWcagNotice.innerHTML = `
        <strong>WCAG 2.2 (1.4.1 Use of Color):</strong> Os pilares editoriais nunca usam apenas cor como indicador exclusivo; combinam sempre rótulo textual de secção com contraste superior a 4.5:1.
      `;

      dom.benchSpecimenControls.querySelectorAll('.witness-ctrl-btn').forEach(btn => {
        btn.onclick = () => {
          state.witnessState.guardianPillar = btn.dataset.pillar;
          renderBenchSpecimen(coord, dataObj);
        };
      });

    } else if (coord === 'L2.N7') {
      // BBC GEL: Áreas de Toque e Tipografia Reith
      dom.benchSpecimenCanvas.innerHTML = `
        <div class="bbc-card-specimen">
          <div class="bbc-spec-trafalgar">BBC News: Trafalgar Scale (32px/36px)</div>
          <p style="font-family: var(--font-sans); font-size: 14px; margin: 0.5rem 0 1rem; color: #333;">
            Escala histórica 'Body Copy' (15px) na família tipográfica BBC Reith, com espaçamento vertical de 8px.
          </p>
          <div class="bbc-touch-target-box">
            <span>LER ARTIGO (ALVO TÁTIL 44×44PX)</span>
            <div class="touch-target-overlay ${state.witnessState.bbcTouchVisible ? 'visible' : ''}"></div>
          </div>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn ${state.witnessState.bbcTouchVisible ? 'active' : ''}" id="btnToggleBbcTouch">
          ${state.witnessState.bbcTouchVisible ? 'Ocultar Área de Toque' : 'Inspecionar Alvo Tátil (44×44px)'}
        </button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>WCAG 2.2 (2.5.8 Target Size Minimum):</strong> O BBC GEL foi pioneiro ao estabelecer áreas mínimas de interação de 44×44px para evitar erros de toque no polegar móvel.
      `;
      document.getElementById('btnToggleBbcTouch').onclick = () => {
        state.witnessState.bbcTouchVisible = !state.witnessState.bbcTouchVisible;
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L3.N7') {
      // Financial Times: Salmão Oficial & Visual Vocabulary
      dom.benchSpecimenCanvas.innerHTML = `
        <div class="ft-card-specimen">
          <span class="ft-tag">MARKETS &amp; ECONOMY</span>
          <h4 class="ft-headline">Financial Times Origami: Ergonomia sobre Superfície Salmão Oficial</h4>
          <p style="font-size: 12px; line-height: 1.45; margin-bottom: 0.75rem;">A cor salmão (#FFF1E5) reduz a fadiga ocular em leituras prolongadas de tabelas e gráficos financeiros.</p>
          <div style="font-family: var(--font-mono); font-size: 9px; font-weight: 800; color: #990F3D; margin-bottom: 4px;">
            FT VISUAL VOCABULARY [GRAFICO ${(state.witnessState.ftChartIndex % 2) + 1}/2]
          </div>
          <div style="display: flex; gap: 4px; height: 45px; align-items: flex-end; background: rgba(0,0,0,0.04); padding: 4px;">
            <div style="width: 20%; height: ${state.witnessState.ftChartIndex % 2 === 0 ? '45%' : '80%'}; background: #0F4C5C;"></div>
            <div style="width: 20%; height: ${state.witnessState.ftChartIndex % 2 === 0 ? '70%' : '35%'}; background: #0F4C5C;"></div>
            <div style="width: 20%; height: ${state.witnessState.ftChartIndex % 2 === 0 ? '95%' : '60%'}; background: #A81E17;"></div>
            <div style="width: 20%; height: ${state.witnessState.ftChartIndex % 2 === 0 ? '60%' : '90%'}; background: #0F4C5C;"></div>
            <div style="width: 20%; height: ${state.witnessState.ftChartIndex % 2 === 0 ? '85%' : '40%'}; background: #0F4C5C;"></div>
          </div>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn" id="btnToggleFtChart">Alternar Vocabulário Gráfico</button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>WCAG 2.2 (1.4.3 Contrast):</strong> A paleta do FT Origami atinge 11.2:1 AAA na relação entre texto escuro e o papel salmão.
      `;
      document.getElementById('btnToggleFtChart').onclick = () => {
        state.witnessState.ftChartIndex++;
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L4.N7') {
      // The New York Times: Ink System
      const isDark = state.witnessState.nytTheme === 'dark';
      dom.benchSpecimenCanvas.innerHTML = `
        <div class="nyt-card-specimen" style="background-color: ${isDark ? '#121212' : '#FFFFFF'}; color: ${isDark ? '#F5F5F5' : '#121212'}; border-color: ${isDark ? '#333' : '#111'};">
          <div style="font-family: var(--font-mono); font-size: 9.5px; text-transform: uppercase; color: ${isDark ? '#999' : '#666'}; margin-bottom: 4px;">
            The New York Times · Ink System
          </div>
          <h4 class="nyt-headline-cheltenham" style="color: ${isDark ? '#FFF' : '#121212'};">Da Gray Lady ao Sistema Ink: Inversão Semântica de Tokens</h4>
          <p style="font-size: 12px; line-height: 1.45; margin: 0.5rem 0; color: ${isDark ? '#CCC' : '#333'};">
            A arquitetura de tokens do NYT mapeia variáveis semânticas que invertem luz e contraste sem adulterar a hierarquia tipográfica Cheltenham.
          </p>
          <div style="font-family: var(--font-mono); font-size: 10px; padding: 4px 8px; background: ${isDark ? '#222' : '#F0F0F0'}; border: 1px solid ${isDark ? '#444' : '#DDD'};">
            ▶ 12:45 OUVIR ARTIGO · VELOCIDADE 1.0×
          </div>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn ${!isDark ? 'active' : ''}" id="btnNytLight">Modo Claro (Papel)</button>
        <button class="witness-ctrl-btn ${isDark ? 'active' : ''}" id="btnNytDark">Modo Escuro (Ink Dark)</button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>WCAG 2.2 (1.4.11 Non-text Contrast):</strong> Controlos de áudio e divisórias de secção mantêm rácio mínimo de 3:1 em ambos os modos cromáticos.
      `;
      document.getElementById('btnNytLight').onclick = () => {
        state.witnessState.nytTheme = 'light';
        renderBenchSpecimen(coord, dataObj);
      };
      document.getElementById('btnNytDark').onclick = () => {
        state.witnessState.nytTheme = 'dark';
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L5.N7') {
      // NewsKit Multi-Brand (The Times vs The Sun)
      const isTimes = state.witnessState.newskitBrand === 'times';
      dom.benchSpecimenCanvas.innerHTML = `
        <div class="newskit-specimen-card ${isTimes ? 'brand-thetimes' : 'brand-thesun'}">
          <div style="font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">
            ${isTimes ? 'THE TIMES — COURT &amp; POLITICS' : 'THE SUN — BREAKING CELEBS'}
          </div>
          <h4 style="font-size: 1.25rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.5rem;">
            NewsKit Multi-Brand Architecture: Um Código, Duas Culturas Editoriais
          </h4>
          <p style="font-size: 11.5px; line-height: 1.4;">
            A mesma estrutura de componentes suporta a solenidade serifa do The Times e o impacto tabloide vermelho do The Sun através de tokens temáticos.
          </p>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn ${isTimes ? 'active' : ''}" id="btnNkTimes">Tema: The Times (Serif, Preto)</button>
        <button class="witness-ctrl-btn ${!isTimes ? 'active' : ''}" id="btnNkSun">Tema: The Sun (Sans, Vermelho)</button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>W3C DTCG Format:</strong> A governança de tokens multi-marca do NewsKit é hoje referência internacional em sistemas editoriais federados.
      `;
      document.getElementById('btnNkTimes').onclick = () => {
        state.witnessState.newskitBrand = 'times';
        renderBenchSpecimen(coord, dataObj);
      };
      document.getElementById('btnNkSun').onclick = () => {
        state.witnessState.newskitBrand = 'sun';
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L6.N7') {
      // Público / Diagnóstico Português
      const isFixed = state.witnessState.ptAuditFixed;
      dom.benchSpecimenCanvas.innerHTML = `
        <div class="publico-audit-specimen">
          <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; margin-bottom: 6px; padding: 2px 6px; display: inline-block; background: ${isFixed ? '#00703C' : '#D4351C'}; color: #FFF;">
            ${isFixed ? 'PROPOSTA DS MESTRADO: CONFORME WCAG AAA (7.2:1)' : 'DIAGNÓSTICO ORIGINAL: FALHA WCAG 1.4.3 (3.2:1)'}
          </div>
          <div style="font-family: var(--font-mono); font-size: 10.5px; margin-bottom: 4px; color: ${isFixed ? '#2A2A2A' : '#888888'};">
            POR REDAÇÃO PÚBLICO · 18 OUTUBRO 2026, 11:45
          </div>
          <h4 class="pt-headline">
            <span style="color: #A81E17;">Público:</span> Auditoria Crítica aos Metadados e DL n.º 82/2022
          </h4>
          <p style="font-size: 12px; line-height: 1.5; color: #333;">
            O diagnóstico ao jornal de referência português demonstra a urgência de uma nova arquitetura de tokens que cumpra a legislação nacional e europeia de acessibilidade.
          </p>
        </div>
      `;
      dom.benchSpecimenControls.innerHTML = `
        <button class="witness-ctrl-btn ${!isFixed ? 'active' : ''}" id="btnAuditOrig">Modo Original (Falha de Contraste #888)</button>
        <button class="witness-ctrl-btn ${isFixed ? 'active' : ''}" id="btnAuditFix">Proposta de Correção (Token #2A2A2A AAA)</button>
      `;
      dom.benchWcagNotice.innerHTML = `
        <strong>Decreto-Lei n.º 82/2022 &amp; Diretiva UE 2019/882:</strong> A transposição das regras europeias obriga à conformidade integral dos órgãos de comunicação social digitais portugueses.
      `;
      document.getElementById('btnAuditOrig').onclick = () => {
        state.witnessState.ptAuditFixed = false;
        renderBenchSpecimen(coord, dataObj);
      };
      document.getElementById('btnAuditFix').onclick = () => {
        state.witnessState.ptAuditFixed = true;
        renderBenchSpecimen(coord, dataObj);
      };

    } else if (coord === 'L7.N7') {
      // OBSERVADOR: A SUÍTE NATIVA DIGITAL COMPLETA (3 ORGANISMOS REAIS)
      renderObservadorSpecimen();
    }
  }

  // ==========================================================================
  // 7. COMPONENTE-TESTEMUNHA REAL DO OBSERVADOR (L7.N7)
  // ==========================================================================
  function renderObservadorSpecimen() {
    const view = state.witnessState.obsView;
    const isAnnual = state.witnessState.obsBilling === 'annual';
    const isPlaying = state.witnessState.obsAudioPlaying;

    dom.benchSpecimenCanvas.innerHTML = `
      <div class="obs-system-container">
        
        <!-- FITA DE SUBSCRIÇÃO DO VINHO (PERSISTENTE) -->
        <div class="obs-wine-ribbon">
          <span>Já somos quase 50.000. Assine e receba 1 garrafa de vinho.</span>
          <button class="obs-pill-subscribe-btn" id="btnObsRibbonSubscribe">Assinar</button>
        </div>
        <div class="obs-sponsor-subribbon">
          <span>◐</span> 1242,2 kWh poupados com a <strong>XPENG</strong> ⓘ
        </div>

        <!-- ORGANISMO 1: GRELHA DA HOME -->
        <div class="obs-view-pane ${view === 'home' ? 'is-active' : ''}" id="paneObsHome">
          <div class="obs-home-grid">
            <!-- Coluna 1: Manchete Principal -->
            <div class="obs-home-main-col">
              <div class="obs-photo-placeholder lead-photo">
                <span>FOTO: ZELENSKY &amp; TRUMP</span>
              </div>
              <div class="obs-kicker-flag">🇺🇦 GUERRA NA UCRÂNIA</div>
              <h3 class="obs-lead-headline">A corda entre Zelensky e Trump partiu de vez?</h3>
              <p class="obs-lead-text">
                No espaço de uma semana, Ucrânia enfrentou falhas no Starlink e nas informações militares vindas dos EUA. Trump, pressionado pelas intercalares, aponta a Zelensky.
              </p>
            </div>

            <!-- Coluna 2: Secundário & Lista Compacta -->
            <div class="obs-home-sub-col">
              <div class="obs-photo-placeholder sub-photo">
                <span>LISBOA / ACAMPADA</span>
              </div>
              <span class="obs-micro-kicker">MANIFESTAÇÕES</span>
              <h4 class="obs-sub-title">"É para aguentar." A primeira noite de acampada em Lisboa</h4>

              <div class="obs-compact-list">
                <div class="obs-list-item">
                  <div class="obs-thumb-box">FOTO</div>
                  <div>
                    <span class="obs-micro-kicker">PROTESTOS</span>
                    <p class="obs-item-title"><span class="obs-live-badge">Em direto/</span> Porto no 9.º dia de protestos</p>
                  </div>
                </div>
                <div class="obs-list-item">
                  <div class="obs-thumb-box">🎧</div>
                  <div>
                    <span class="obs-micro-kicker">PODCAST PLUS</span>
                    <p class="obs-item-title">A Caça ao Estripador de Lisboa em teatro</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coluna 3: Fluxos Verticais -->
            <div class="obs-home-stream-col">
              <div>
                <span class="obs-stream-kicker">COMPRAS</span>
                <h5 class="obs-stream-title">Relógios, ténis, mobiliário: 23 lojas novas</h5>
                <p class="obs-stream-excerpt">Da rua aos centros comerciais, várias marcas abriram portas...</p>
              </div>
              <div>
                <span class="obs-stream-kicker">PODCASTS</span>
                <h5 class="obs-stream-title">O regresso de "A Caça ao Estripador"</h5>
                <p class="obs-stream-excerpt">Mais de 30 anos após o homicídio que chocou o país...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ORGANISMO 2: ARTIGO COM ÁUDIO INTEGRADO -->
        <div class="obs-view-pane ${view === 'article' ? 'is-active' : ''}" id="paneObsArticle">
          <div class="obs-article-header">
            <div class="obs-art-kicker-row">
              <span class="obs-topic-kicker">PODCASTS / PODCAST PLUS</span>
              <button class="obs-btn-alert">🔔 Ativar alertas</button>
            </div>
            <h3 class="obs-article-headline">
              "A Caça ao Estripador de Lisboa": o Podcast Plus do Observador transforma-se em espetáculo imersivo
            </h3>
            <p class="obs-article-lead">
              A investigação jornalística do serial killer dos anos 90 dá vida a peça de teatro com estreia marcada para 28 de outubro.
            </p>

            <!-- Barra de Utilidade do Leitor com Botão de Áudio -->
            <div class="obs-reader-toolbar">
              <button id="btnObsAudioToggle" class="obs-reader-pill obs-audio-pill">
                <span>🎧</span> <strong>${isPlaying ? '02:14 / 06:12' : '6 min'}</strong>
              </button>
              <button class="obs-reader-pill"><span>💬</span> 1 comentário</button>
              <div style="margin-left: auto; display: flex; gap: 4px;">
                <span class="obs-reader-pill">🔖</span>
                <span class="obs-reader-pill">🎁</span>
                <span class="obs-reader-pill">↗</span>
              </div>
            </div>

            <!-- Player Inline de Áudio -->
            <div style="background: #F0F4F8; padding: 8px; margin-top: 6px; border-left: 3px solid #004F71; display: ${isPlaying ? 'block' : 'none'};">
              <div style="font-family: var(--font-mono); font-size: 9px; font-weight: 800; color: #004F71;">
                EMISSÃO RÁDIO OBSERVADOR · 98.7 FM · EM REPRODUÇÃO
              </div>
              <div style="height: 4px; background: #CCE0EB; margin-top: 4px;">
                <div style="height: 100%; width: 36%; background: #004F71;"></div>
              </div>
            </div>
          </div>

          <div style="padding: 0.5rem 0.25rem; font-family: var(--font-serif); font-size: 11.5px; line-height: 1.5; color: #2B2B2B;">
            <p style="margin-bottom: 0.5rem;">
              Entre 1992 e 1993, a polícia registou cinco homicídios de prostitutas na região de Lisboa. O caso saltou do podcast jornalístico para o teatro imersivo...
            </p>
          </div>
        </div>

        <!-- ORGANISMO 3: PAYWALL DINÂMICA DE ASSINANTES -->
        <div class="obs-view-pane ${view === 'paywall' ? 'is-active' : ''}" id="paneObsPaywall">
          <div style="background-color: #F8F9FA; border: 1px solid #D5DBDC; padding: 1rem;">
            <span style="font-family: var(--font-mono); font-size: 9px; font-weight: 800; color: #004F71; text-transform: uppercase;">
              Assine o Observador para continuar a ler
            </span>
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; margin: 4px 0 8px;">
              Já somos quase 50.000 assinantes.
            </h4>

            <!-- Alternador Anual / Mensal -->
            <div style="display: flex; gap: 4px; margin-bottom: 0.75rem;">
              <button class="witness-ctrl-btn ${isAnnual ? 'active' : ''}" id="btnObsAnnual">
                Anual (Oferta 2 meses)
              </button>
              <button class="witness-ctrl-btn ${!isAnnual ? 'active' : ''}" id="btnObsMonthly">
                Mensal
              </button>
            </div>

            <!-- Lista de Planos -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="background: #FFF; border: 1px solid #DDD; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
                <div><input type="radio" name="obsPlan" /> <strong>Low Cost</strong></div>
                <div style="font-size: 11px;"><strong>${isAnnual ? '29,90€ /ano' : '4,99€ /mês'}</strong></div>
              </div>

              <div style="background: #FFF; border: 2px solid #004F71; padding: 8px 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div><input type="radio" name="obsPlan" checked /> <strong>Standard (Recomendado)</strong></div>
                  <div style="font-size: 11px;"><strong style="color: #004F71;">${isAnnual ? '49,90€ /ano' : '7,99€ /mês'}</strong></div>
                </div>
                ${isAnnual ? `
                  <div style="margin-top: 6px; padding: 6px; background: #5C1D24; color: #FFF; font-size: 10px; font-weight: 700;">
                    🍷 Oferta 1 garrafa de vinho Herdade São Miguel Colheita Selecionada Tinto Magnum 2023 + Visita à Adega.
                  </div>
                ` : ''}
              </div>

              <div style="background: #FFF; border: 1px solid #DDD; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
                <div><input type="radio" name="obsPlan" /> <strong>Premium</strong></div>
                <div style="font-size: 11px;"><strong>${isAnnual ? '79,90€ /ano' : '9,99€ /mês'}</strong></div>
              </div>
            </div>

            <button style="width: 100%; margin-top: 0.75rem; background: #004F71; color: #FFF; border: none; padding: 8px; font-family: var(--font-mono); font-size: 11px; font-weight: 800; cursor: pointer;">
              ASSINAR AGORA
            </button>
          </div>
        </div>

      </div>
    `;

    // Botões de Controlo da Suíte do Observador
    dom.benchSpecimenControls.innerHTML = `
      <button class="witness-ctrl-btn ${view === 'home' ? 'active' : ''}" id="btnObsViewHome">1. Grelha da Home</button>
      <button class="witness-ctrl-btn ${view === 'article' ? 'active' : ''}" id="btnObsViewArticle">2. Artigo com Áudio</button>
      <button class="witness-ctrl-btn ${view === 'paywall' ? 'active' : ''}" id="btnObsViewPaywall">3. Paywall Dinâmica</button>
    `;

    dom.benchWcagNotice.innerHTML = `
      <strong>Análise Ergonómica &amp; WCAG 2.2:</strong> O Observador articula a conversão comunitária com reprodutores de áudio integrados no cabeçalho. As cores institucionais (#004F71 e #5C1D24) cumprem o critério 1.4.3 AA sobre branco.
    `;

    // Eventos dos Botões
    document.getElementById('btnObsViewHome').onclick = () => {
      state.witnessState.obsView = 'home';
      renderObservadorSpecimen();
    };
    document.getElementById('btnObsViewArticle').onclick = () => {
      state.witnessState.obsView = 'article';
      renderObservadorSpecimen();
    };
    document.getElementById('btnObsViewPaywall').onclick = () => {
      state.witnessState.obsView = 'paywall';
      renderObservadorSpecimen();
    };

    const audioToggle = document.getElementById('btnObsAudioToggle');
    if (audioToggle) {
      audioToggle.onclick = () => {
        state.witnessState.obsAudioPlaying = !state.witnessState.obsAudioPlaying;
        renderObservadorSpecimen();
      };
    }

    const btnAnnual = document.getElementById('btnObsAnnual');
    if (btnAnnual) {
      btnAnnual.onclick = () => {
        state.witnessState.obsBilling = 'annual';
        renderObservadorSpecimen();
      };
    }

    const btnMonthly = document.getElementById('btnObsMonthly');
    if (btnMonthly) {
      btnMonthly.onclick = () => {
        state.witnessState.obsBilling = 'monthly';
        renderObservadorSpecimen();
      };
    }

    const ribbonSub = document.getElementById('btnObsRibbonSubscribe');
    if (ribbonSub) {
      ribbonSub.onclick = () => {
        state.witnessState.obsView = 'paywall';
        renderObservadorSpecimen();
      };
    }
  }

  // ==========================================================================
  // ==========================================================================
  // 8. MODO DE COMPARAÇÃO / FIXAR NÓS MÚLTIPLOS (PIN NODES - TECLA C)
  // ==========================================================================
  function togglePinNode(targetCoord) {
    const coord = targetCoord || state.activeCoord;
    const index = state.pinnedCoords.indexOf(coord);
    if (index > -1) {
      state.pinnedCoords.splice(index, 1);
    } else {
      state.pinnedCoords.push(coord);
    }
    renderPinnedSection();
  }

  function unpinNode(coord) {
    const index = state.pinnedCoords.indexOf(coord);
    if (index > -1) {
      state.pinnedCoords.splice(index, 1);
      renderPinnedSection();
    }
  }

  function unpinAllNodes() {
    state.pinnedCoords = [];
    renderPinnedSection();
  }

  function renderPinnedSection() {
    if (!dom.benchPinnedSection) return;

    if (state.pinnedCoords.length === 0) {
      dom.benchPinnedSection.style.display = 'none';
      if (dom.btnPinNode) {
        dom.btnPinNode.classList.remove('is-pinned');
        dom.lblPinAction.textContent = 'FIXAR PARA COMPARAR (C)';
      }
      return;
    }

    dom.benchPinnedSection.style.display = 'block';
    if (dom.pinnedCountBadge) {
      dom.pinnedCountBadge.textContent = `COMPARAÇÃO ATIVA (${state.pinnedCoords.length} NÓ${state.pinnedCoords.length > 1 ? 'S' : ''} FIXADO${state.pinnedCoords.length > 1 ? 'S' : ''})`;
    }

    if (dom.pinnedNodesGrid) {
      dom.pinnedNodesGrid.innerHTML = '';
      state.pinnedCoords.forEach(coord => {
        const dataObj = getNodeData(coord);
        if (!dataObj) return;

        const card = document.createElement('div');
        card.className = 'bench-pinned-card';
        card.innerHTML = `
          <div class="pinned-card-top">
            <span class="pinned-card-coord">[ ${coord} ] · ${dataObj.row.entity}</span>
            <button class="pinned-card-unpin-btn" title="Desafixar este nó" data-coord="${coord}">✕</button>
          </div>
          <h4 class="pinned-card-title">${dataObj.node.title}</h4>
          <div class="pinned-card-body">
            <p>${dataObj.node.content}</p>
          </div>
        `;

        card.querySelector('.pinned-card-unpin-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          unpinNode(coord);
        });

        card.addEventListener('click', () => {
          const { rIdx, cIdx } = getIndicesFromCoord(coord);
          setFocusedCell(rIdx, cIdx);
          openBench(coord);
        });

        dom.pinnedNodesGrid.appendChild(card);
      });
    }

    // Atualizar estado do botão Pin no nó ativo
    if (dom.btnPinNode) {
      if (state.pinnedCoords.includes(state.activeCoord)) {
        dom.btnPinNode.classList.add('is-pinned');
        dom.lblPinAction.textContent = 'FIXADO ✓ (C)';
      } else {
        dom.btnPinNode.classList.remove('is-pinned');
        dom.lblPinAction.textContent = 'FIXAR PARA COMPARAR (C)';
      }
    }
  }

  // ==========================================================================
  // 9. CAMADA DE LINHAGEM HISTÓRICA (SVG ORTHOGONAL CONNECTORS - TECLA L)
  // ==========================================================================
  function toggleLineageLayer() {
    state.isLineageActive = !state.isLineageActive;
    if (state.isLineageActive) {
      dom.lineageSvg.classList.add('active');
      dom.btnToggleLineage.classList.add('active');
      renderLineagePaths();
    } else {
      dom.lineageSvg.classList.remove('active');
      dom.btnToggleLineage.classList.remove('active');
      dom.lineageTooltip.setAttribute('aria-hidden', 'true');
    }
  }

  function renderLineagePaths() {
    dom.lineagePathsGroup.innerHTML = '';
    const vpRect = dom.gridViewport.getBoundingClientRect();
    const scrollLeft = dom.gridViewport.scrollLeft;
    const scrollTop = dom.gridViewport.scrollTop;

    DATA.crossReferences.forEach(cr => {
      const fromEl = document.getElementById(`cell-${cr.from.replace('.', '-')}`);
      const toEl = document.getElementById(`cell-${cr.to.replace('.', '-')}`);
      if (!fromEl || !toEl) return;

      const fRect = fromEl.getBoundingClientRect();
      const tRect = toEl.getBoundingClientRect();

      // Centro horizontal das células
      const fromX = (fRect.left - vpRect.left) + scrollLeft + (fRect.width / 2);
      const toX = (tRect.left - vpRect.left) + scrollLeft + (tRect.width / 2);

      // Limites verticais: sai da base da célula de origem e entra pelo topo da de destino
      const fromY = (fRect.bottom - vpRect.top) + scrollTop;
      const toY = (tRect.top - vpRect.top) + scrollTop;

      let pathData = '';

      if (Math.abs(fromX - toX) < 4) {
        // MESMA COLUNA (ex: L1.N2 -> L6.N2 ou L6.N7 -> L7.N7):
        // Linha reta vertical única descendo da base de L1.N2 ao topo de L6.N2!
        // Sem pontos redundantes -> O vetor final aponta ESTRITAMENTE para BAIXO (90°)!
        pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`;
      } else {
        // COLUNAS DIFERENTES (ex: L0.N2 -> L1.N6 ou L2.N5 -> L6.N7):
        // Desce até ao gutter intermédio entre as duas linhas, corre horizontalmente e entra verticalmente no topo de destino
        const midY = (fromY + toY) / 2;
        pathData = `M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`;
      }

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', pathData);
      pathEl.setAttribute('class', 'lineage-connector-path');
      pathEl.setAttribute('marker-end', 'url(#lineageArrow)');

      // Eventos de Tooltip
      pathEl.addEventListener('mouseenter', (e) => {
        dom.lineageTooltipHead.textContent = `${cr.from} ➔ ${cr.to}`;
        dom.lineageTooltipBody.textContent = cr.relation;
        dom.lineageTooltip.style.left = `${e.clientX + 12}px`;
        dom.lineageTooltip.style.top = `${e.clientY + 12}px`;
        dom.lineageTooltip.setAttribute('aria-hidden', 'false');
      });

      pathEl.addEventListener('mousemove', (e) => {
        dom.lineageTooltip.style.left = `${e.clientX + 12}px`;
        dom.lineageTooltip.style.top = `${e.clientY + 12}px`;
      });

      pathEl.addEventListener('mouseleave', () => {
        dom.lineageTooltip.setAttribute('aria-hidden', 'true');
      });

      pathEl.addEventListener('click', () => {
        const { rIdx, cIdx } = getIndicesFromCoord(cr.to);
        setFocusedCell(rIdx, cIdx);
        openBench(cr.to);
      });

      dom.lineagePathsGroup.appendChild(pathEl);
    });
  }

  // ==========================================================================
  // 10. GESTÃO DE TEMAS E ACESSIBILIDADE TIPOGRÁFICA
  // ==========================================================================
  function setTheme(theme) {
    state.currentTheme = theme;
    dom.body.classList.remove('theme-paper-light', 'theme-paper-dark', 'theme-high-contrast');
    
    if (theme === 'paper-dark') {
      dom.body.classList.add('theme-paper-dark');
    } else if (theme === 'high-contrast') {
      dom.body.classList.add('theme-high-contrast');
    } else {
      dom.body.classList.add('theme-paper-light');
    }

    // Atualizar botões no sheet mobile
    if (dom.btnThemeMineralLight) dom.btnThemeMineralLight.classList.toggle('active', theme === 'paper-light');
    if (dom.btnThemeMineralDark) dom.btnThemeMineralDark.classList.toggle('active', theme === 'paper-dark');
    if (dom.btnThemeHighContrast) dom.btnThemeHighContrast.classList.toggle('active', theme === 'high-contrast');
  }

  function setReadingScale(scale) {
    state.readingScale = scale;
    document.documentElement.style.setProperty('--reading-scale', scale);
    document.querySelectorAll('.scale-step-btn').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.scale) === scale);
    });
  }

  // ==========================================================================
  // 11. BOTTOM SHEETS & MOBILE INTERACTION
  // ==========================================================================
  function renderMobileSheetsContent() {
    // Lista de Casos no Sheet
    dom.sheetCasesButtons.innerHTML = '';
    DATA.rows.forEach((row, idx) => {
      const btn = document.createElement('button');
      btn.className = 'sheet-quick-btn';
      btn.style.cssText = 'padding: 6px; font-family: var(--font-mono); font-size: 11px; text-align: left; background: var(--surface-paper-elevated); border: 1px solid var(--border-hairline); cursor: pointer;';
      btn.textContent = `${row.rowId}: ${row.entity}`;
      btn.addEventListener('click', () => {
        setFocusedCell(idx, state.colIndex);
        closeAllSheets();
        openBench(getCoord(idx, state.colIndex));
      });
      dom.sheetCasesButtons.appendChild(btn);
    });

    // Lista de Dimensões no Sheet
    dom.sheetColsButtons.innerHTML = '';
    DATA.columns.forEach((col, idx) => {
      const btn = document.createElement('button');
      btn.className = 'sheet-quick-btn';
      btn.style.cssText = 'padding: 6px; font-family: var(--font-mono); font-size: 11px; text-align: left; background: var(--surface-paper-elevated); border: 1px solid var(--border-hairline); cursor: pointer;';
      btn.textContent = `${col.id}: ${col.name}`;
      btn.addEventListener('click', () => {
        setFocusedCell(state.rowIndex, idx);
        closeAllSheets();
        openBench(getCoord(state.rowIndex, idx));
      });
      dom.sheetColsButtons.appendChild(btn);
    });
  }

  function openSheet(sheetEl) {
    closeAllSheets();
    sheetEl.classList.add('is-open');
    sheetEl.setAttribute('aria-hidden', 'false');
  }

  function closeAllSheets() {
    document.querySelectorAll('.v2-bottom-sheet.is-open').forEach(s => {
      s.classList.remove('is-open');
      s.setAttribute('aria-hidden', 'true');
    });
  }

  // ==========================================================================
  // 12. EVENT LISTENERS E TECLADO RIGOROSO
  // ==========================================================================
  function setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      // Ignorar se o utilizador estiver num input ou textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedCell(state.rowIndex - 1, state.colIndex);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedCell(state.rowIndex + 1, state.colIndex);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedCell(state.rowIndex, state.colIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedCell(state.rowIndex, state.colIndex + 1);
          break;
        case 'Enter':
          e.preventDefault();
          openBench(state.activeCoord);
          break;
        case 'Escape':
          e.preventDefault();
          if (dom.v2HelpModal.getAttribute('aria-hidden') === 'false') {
            dom.v2HelpModal.setAttribute('aria-hidden', 'true');
          } else if (document.querySelector('.v2-bottom-sheet.is-open')) {
            closeAllSheets();
          } else if (state.isBenchOpen) {
            closeBench();
          }
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          togglePinNode();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          toggleLineageLayer();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          const isHelpOpen = dom.v2HelpModal.getAttribute('aria-hidden') === 'false';
          dom.v2HelpModal.setAttribute('aria-hidden', isHelpOpen ? 'true' : 'false');
          break;
      }
    });
  }

  function bindEvents() {
    // Bancada
    dom.btnCloseBench.addEventListener('click', closeBench);
    if (dom.btnPinNode) dom.btnPinNode.addEventListener('click', () => togglePinNode());
    if (dom.btnUnpinAllNodes) dom.btnUnpinAllNodes.addEventListener('click', unpinAllNodes);

    // Barra de Ferramentas
    dom.btnToggleLineage.addEventListener('click', toggleLineageLayer);
    dom.btnToggleTheme.addEventListener('click', () => {
      if (state.currentTheme === 'paper-light') setTheme('paper-dark');
      else if (state.currentTheme === 'paper-dark') setTheme('high-contrast');
      else setTheme('paper-light');
    });

    // Modal de Ajuda
    dom.btnOpenHelpV2.addEventListener('click', () => {
      dom.v2HelpModal.setAttribute('aria-hidden', 'false');
    });
    dom.btnCloseHelpModal.addEventListener('click', () => {
      dom.v2HelpModal.setAttribute('aria-hidden', 'true');
    });
    dom.btnDismissHelp.addEventListener('click', () => {
      dom.v2HelpModal.setAttribute('aria-hidden', 'true');
    });

    // Mobile Bottom Bar
    dom.btnMobileSheetAxes.addEventListener('click', () => openSheet(dom.v2SheetAxes));
    dom.btnMobileSheetA11y.addEventListener('click', () => openSheet(dom.v2SheetA11y));
    dom.btnMobileCompareToggle.addEventListener('click', () => {
      togglePinNode();
      if (!state.isBenchOpen) openBench(state.activeCoord);
    });
    dom.btnMobileCloseNode.addEventListener('click', () => {
      closeBench();
      closeAllSheets();
    });

    // Fecho de Sheets no clique do Scrim ou Botão ✕
    document.querySelectorAll('.sheet-close-btn, .sheet-scrim').forEach(el => {
      el.addEventListener('click', closeAllSheets);
    });

    // Escala Tipográfica
    document.querySelectorAll('.scale-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setReadingScale(parseFloat(btn.dataset.scale));
      });
    });

    // Temas nos Sheets
    if (dom.btnThemeMineralLight) dom.btnThemeMineralLight.addEventListener('click', () => setTheme('paper-light'));
    if (dom.btnThemeMineralDark) dom.btnThemeMineralDark.addEventListener('click', () => setTheme('paper-dark'));
    if (dom.btnThemeHighContrast) dom.btnThemeHighContrast.addEventListener('click', () => setTheme('high-contrast'));

    // Atualização de mirais e linhas SVG no scroll do viewport
    dom.gridViewport.addEventListener('scroll', () => {
      const cellEl = document.getElementById(`cell-${state.activeCoord.replace('.', '-')}`);
      updateCrosshairs(cellEl);
      if (state.isLineageActive) {
        renderLineagePaths();
      }
    });

    // Redimensionamento de janela
    window.addEventListener('resize', () => {
      const cellEl = document.getElementById(`cell-${state.activeCoord.replace('.', '-')}`);
      updateCrosshairs(cellEl);
      if (state.isLineageActive) {
        renderLineagePaths();
      }
    });
  }

  // ==========================================================================
  // 13. BOOTSTRAP DA APLICAÇÃO V2
  // ==========================================================================
  function init() {
    renderMatrix();
    renderMobileSheetsContent();
    setupKeyboardNavigation();
    bindEvents();

    // Iniciar no Nó L0.N1 com mira cartográfica ativa
    setFocusedCell(0, 0);

    console.info('Matriz Editorial v2.0 (O Tear Editorial / Split-Bench Cartográfico) carregada com sucesso.');
  }

  // Executar após DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
