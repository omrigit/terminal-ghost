import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const models = ['gpt-4', 'gpt-3.5-turbo', 'llama-2-70b', 'claude-3-opus', 'mistral-7b', 'gemini-pro'];
const datasets = ['ImageNet', 'COCO', 'WikiText-103', 'CommonCrawl', 'custom_dataset_v2'];

const scenarios = [
  // Training epoch logs
  () => {
    const lines: LogLine[] = [];
    const epoch = Math.floor(Math.random() * 100) + 1;
    const totalEpochs = Math.floor(Math.random() * 50) + epoch;
    const loss = (Math.random() * 2 + 0.1).toFixed(4);
    const accuracy = (Math.random() * 30 + 70).toFixed(2);
    const lr = (Math.random() * 0.001).toExponential(2);
    
    lines.push(createLogLine(`Epoch ${epoch}/${totalEpochs}`, 'info'));
    lines.push(createLogLine(`  loss: ${loss} - accuracy: ${accuracy}% - lr: ${lr}`, 'default'));
    
    const progress = Math.floor((epoch / totalEpochs) * 100);
    lines.push(createLogLine(`Training progress`, 'dim', { isProgress: true, progress }));
    
    if (Math.random() > 0.7) {
      lines.push(createLogLine(`  ✓ New best model saved (val_accuracy: ${(parseFloat(accuracy) + Math.random() * 2).toFixed(2)}%)`, 'success'));
    }
    
    return lines;
  },
  
  // Batch processing
  () => {
    const lines: LogLine[] = [];
    const batch = Math.floor(Math.random() * 1000) + 1;
    const totalBatches = 1000;
    const loss = (Math.random() * 1 + 0.1).toFixed(4);
    const speed = Math.floor(Math.random() * 100) + 50;
    
    lines.push(createLogLine(`[Batch ${batch}/${totalBatches}] loss: ${loss} | ${speed} samples/sec`, 'default'));
    
    if (batch % 100 === 0) {
      lines.push(createLogLine(`[Checkpoint] Model saved at step ${batch}`, 'success'));
    }
    
    return lines;
  },
  
  // Model loading
  () => {
    const lines: LogLine[] = [];
    const model = models[Math.floor(Math.random() * models.length)];
    const params = (Math.random() * 100 + 1).toFixed(1);
    const memory = (Math.random() * 20 + 2).toFixed(1);
    
    lines.push(createLogLine(`Loading model: ${model}`, 'info'));
    lines.push(createLogLine(`  Parameters: ${params}B`, 'dim'));
    lines.push(createLogLine(`  Loading weights...`, 'dim', { isProgress: true, progress: Math.random() * 100 }));
    lines.push(createLogLine(`  ✓ Model loaded (${memory}GB VRAM)`, 'success'));
    
    return lines;
  },
  
  // Inference logs
  () => {
    const lines: LogLine[] = [];
    const model = models[Math.floor(Math.random() * models.length)];
    const tokens = Math.floor(Math.random() * 500) + 50;
    const latency = (Math.random() * 2000 + 100).toFixed(0);
    const tokensPerSec = (tokens / (parseFloat(latency) / 1000)).toFixed(1);
    
    lines.push(createLogLine(`[Inference] Model: ${model}`, 'info'));
    lines.push(createLogLine(`[Inference] Tokens: ${tokens} | Latency: ${latency}ms | ${tokensPerSec} tok/s`, 'default'));
    
    if (Math.random() > 0.8) {
      lines.push(createLogLine(`[Inference] Cache hit rate: ${(Math.random() * 30 + 70).toFixed(1)}%`, 'dim'));
    }
    
    return lines;
  },
  
  // Dataset processing
  () => {
    const lines: LogLine[] = [];
    const dataset = datasets[Math.floor(Math.random() * datasets.length)];
    const samples = Math.floor(Math.random() * 1000000) + 10000;
    
    lines.push(createLogLine(`Processing dataset: ${dataset}`, 'info'));
    lines.push(createLogLine(`  Total samples: ${samples.toLocaleString()}`, 'dim'));
    lines.push(createLogLine(`  Tokenizing...`, 'dim'));
    lines.push(createLogLine(`  Shuffling and batching...`, 'dim'));
    lines.push(createLogLine(`  ✓ Dataset ready (${Math.floor(samples / 32)} batches)`, 'success'));
    
    return lines;
  },
  
  // GPU/Hardware status
  () => {
    const lines: LogLine[] = [];
    const gpuCount = Math.floor(Math.random() * 4) + 1;
    
    lines.push(createLogLine(`[Hardware] GPU Status:`, 'info'));
    
    for (let i = 0; i < gpuCount; i++) {
      const util = Math.floor(Math.random() * 30) + 70;
      const memory = Math.floor(Math.random() * 20) + 60;
      const temp = Math.floor(Math.random() * 20) + 60;
      
      lines.push(createLogLine(`  GPU ${i}: ${util}% util | ${memory}% mem | ${temp}°C`, util > 90 ? 'warning' : 'default'));
    }
    
    return lines;
  },
  
  // Evaluation metrics
  () => {
    const lines: LogLine[] = [];
    
    lines.push(createLogLine(`[Evaluation] Running on validation set...`, 'info'));
    lines.push(createLogLine(`  Accuracy:  ${(Math.random() * 10 + 88).toFixed(2)}%`, 'default'));
    lines.push(createLogLine(`  Precision: ${(Math.random() * 10 + 85).toFixed(2)}%`, 'default'));
    lines.push(createLogLine(`  Recall:    ${(Math.random() * 10 + 83).toFixed(2)}%`, 'default'));
    lines.push(createLogLine(`  F1 Score:  ${(Math.random() * 10 + 84).toFixed(2)}%`, 'default'));
    lines.push(createLogLine(`  ✓ Metrics logged to wandb`, 'success'));
    
    return lines;
  },
  
  // Fine-tuning
  () => {
    const lines: LogLine[] = [];
    const model = models[Math.floor(Math.random() * models.length)];
    
    lines.push(createLogLine(`[FineTune] Starting fine-tuning: ${model}`, 'info'));
    lines.push(createLogLine(`[FineTune] LoRA rank: 16, alpha: 32`, 'dim'));
    lines.push(createLogLine(`[FineTune] Trainable parameters: ${(Math.random() * 50 + 10).toFixed(1)}M (${(Math.random() * 5 + 1).toFixed(2)}%)`, 'dim'));
    lines.push(createLogLine(`[FineTune] Gradient accumulation: 4 steps`, 'dim'));
    
    return lines;
  },
  
  // Vector embeddings
  () => {
    const lines: LogLine[] = [];
    const docs = Math.floor(Math.random() * 10000) + 1000;
    const dim = [384, 768, 1536][Math.floor(Math.random() * 3)];
    
    lines.push(createLogLine(`[Embeddings] Generating embeddings...`, 'info'));
    lines.push(createLogLine(`[Embeddings] Documents: ${docs.toLocaleString()} | Dimension: ${dim}`, 'dim'));
    lines.push(createLogLine(`[Embeddings] ✓ Indexed in vector store (${(docs * dim * 4 / 1024 / 1024).toFixed(2)} MB)`, 'success'));
    
    return lines;
  },
  
  // RAG pipeline
  () => {
    const lines: LogLine[] = [];
    const chunks = Math.floor(Math.random() * 10) + 3;
    const latency = (Math.random() * 500 + 100).toFixed(0);
    
    lines.push(createLogLine(`[RAG] Query received`, 'info'));
    lines.push(createLogLine(`[RAG] Retrieved ${chunks} relevant chunks (similarity > 0.${Math.floor(Math.random() * 3) + 7})`, 'default'));
    lines.push(createLogLine(`[RAG] Context tokens: ${Math.floor(Math.random() * 2000) + 500}`, 'dim'));
    lines.push(createLogLine(`[RAG] Response generated in ${latency}ms`, 'success'));
    
    return lines;
  },
];

export const generateAiLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0 && !lines[0].timestamp) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
