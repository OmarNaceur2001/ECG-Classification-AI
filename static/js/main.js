const CLASS_LABELS = [
  "LBBB",
  "Normal", 
  "PAC",
  "PVC",
  "RBBB",
  "V-Fib"
];

const CLASS_COLORS = [
  'var(--error-red)',      // LBBB
  'var(--success-green)',  // Normal  
  'var(--warning-orange)', // PAC
  'var(--error-red)',      // PVC
  'var(--error-red)',      // RBBB
  'var(--error-red)'       // V-Fib
];

let selectedFile = null;

document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  
  // Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadFile(file);
    }
  });
  
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadFile(file);
  });
  
  function loadFile(file) {
    selectedFile = file;
    analyzeBtn.disabled = false;
    dropZone.innerHTML = `
      <div style="font-size: 4rem; color: var(--accent-blue);">✓</div>
      <div class="drop-text">${file.name}</div>
      <div class="drop-subtext">${(file.size/1024/1024).toFixed(1)} MB</div>
    `;
    // Reset UI
    resultsDiv.style.display = 'none';
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'none';
  }
  
  analyzeBtn.addEventListener('click', analyze);
  
  async function analyze() {
    if (!selectedFile) return;
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="spinner"></span>Analyse ResNet-50 en cours...';
    analyzeBtn.classList.add('loading');
    dropZone.style.display = 'none';
    
    loadingDiv.style.display = 'block';
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }
      
      const data = await response.json();
      showResults(data);
      
    } catch (error) {
      errorDiv.textContent = error.message || 'Erreur lors de l\'analyse';
      errorDiv.style.display = 'block';
    } finally {
      loadingDiv.style.display = 'none';
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '🔄 Nouvelle Analyse';
      analyzeBtn.classList.remove('loading');
    }
  }
  
  function showResults(data) {
    const topIdx = data.predicted_class;
    const topConf = (data.confidence * 100).toFixed(1);
    
    document.querySelector('.pred-class').textContent = CLASS_LABELS[topIdx];
    document.querySelector('.pred-confidence').textContent = `${topConf}%`;
    
    // Sort probabilities descending
    const sortedProbs = data.probabilities.map((p, i) => ({idx: i, prob: p}))
      .sort((a, b) => b.prob - a.prob);
    
    const barsContainer = document.querySelector('.confidence-bars');
    barsContainer.innerHTML = '';
    
    sortedProbs.forEach(({idx, prob}) => {
      const isTop = idx === topIdx;
      const percent = (prob * 100).toFixed(1);
      const barWidth = (prob * 100) + '%';
      
      const barClass = isTop ? 'top' : 
                      idx === 1 ? 'warning' : 
                      idx === 3 || idx === 4 || idx === 5 ? 'danger' : 'low';
      
      const bar = document.createElement('div');
      bar.className = 'conf-item';
      bar.innerHTML = `
        <div class="conf-label">${CLASS_LABELS[idx]}</div>
        <div class="conf-bar">
          <div class="conf-fill ${barClass}" style="width: 0;"></div>
        </div>
        <div class="conf-value">${percent}%</div>
      `;
      
      barsContainer.appendChild(bar);
      
      // Animate bar
      setTimeout(() => {
        bar.querySelector('.conf-fill').style.width = barWidth;
      }, 100);
    });
    
    resultsDiv.style.display = 'block';
    dropZone.style.display = 'block';
    dropZone.innerHTML = `
      <div style="font-size: 4rem; color: var(--success-green);">✓</div>
      <div class="drop-text">Analyse terminée</div>
      <div class="drop-subtext">Cliquez pour nouvelle image</div>
    `;
  }
});
