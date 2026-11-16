---
layout: page
title: work
permalink: /portfolio/
---

<article class="entry" markdown="1">

### Kapture v3 — 11-language Indic ASR
<div class="tags">python · pytorch · speech · fonada</div>

Contributed to data processing, data generation and model training. Strict WER of **21.9%** across the 74,500-clip Vistaar benchmark (saaras:v3 28.3%, saaras:v4 29.0%), **6.06 OI-WER** on Monsoon Hindi, **13.1 WER** on Vaani Hindi and **5.54%** averaged over nine English sets. Served as a batch transcription API on FonadaLabs.

{% include metric-chart.html %}

The gap is smaller under Sarvam's normalizer (17.3% vs 18.1%), and the model is a team effort at Fonada. All numbers come from the public model card.

[model card](https://huggingface.co/fonada/kapture-v3)
</article>

<article class="entry" markdown="1">

### Deep Learning with PyTorch — a tutorial book
<div class="tags">python · pytorch · numpy · matplotlib</div>

A 90-page, 17-chapter book that goes from classical machine learning through transformers, diffusion models, reinforcement learning, deployment and graph neural networks. Every chapter pairs the explanation with runnable Python scripts.

[read it](https://protosol.github.io/deep-learning/) · [source](https://github.com/ProtoSol/deep-learning)
</article>

<article class="entry" markdown="1">

### OWSM Smart Turn v2 — end-of-turn detection
<div class="tags">pytorch · onnx · owsm · open source</div>

Fine-tuned the OWSM v4 speech encoder (102M parameters, pretrained on 320k hours) with a Smart Turn classification head for 8-second, clip-level end-of-turn detection in English and eight Indian languages. Built a balanced complete/incomplete speech set from LLM utterances synthesized with Sarvam TTS, trained with noise augmentation and exported an INT8 ONNX model.

**0.909** weighted F1 on 10,458 Indian-language test clips versus **0.712** for stock Smart Turn v3.2 (+0.197); **0.914** across the full 18,278-clip Indian + English set.

[github.com/ProtoSol/smart-turn-owsm](https://github.com/ProtoSol/smart-turn-owsm)
</article>

<article class="entry" markdown="1">

### Real-time noise suppression
<div class="tags">pytorch · audio · fonada</div>

PyTorch noise-suppression pipeline for real-time audio with batched inference; evaluated latency/quality trade-offs for voice-bot workflows.
</article>

<article class="entry" markdown="1">

### Turn-taking for production voice bots
<div class="tags">voice ai · telephony · fonada</div>

Predicting when the system should listen, respond, or pause so telephony conversations stay natural. Ongoing.
</article>

<article class="entry" markdown="1">

### earlier work
<div class="tags">python · streamlit · excel · power bi</div>

Streamlit price-forecasting app over Yahoo Finance data (time-series sequence model); Excel and Power BI dashboards for call-center response volume and for sales segments where margins fell despite stable revenue.
</article>
