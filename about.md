---
layout: page
title: about
permalink: /about/
---
Applied ML engineer focused on voice AI. Contributed to Kapture v3, an 11-language Indic ASR model at 21.9% strict WER across the Vistaar benchmark and 6.06 OI-WER on conversational Monsoon Hindi, and open-sourced an end-of-turn detector that lifts Indian-language weighted F1 from 0.712 to 0.909.

## experience

<div class="entry" markdown="1">
<div class="role"><strong>Fonada, Noida</strong><span class="muted">Jun 2025 – present</span></div>
<div class="meta">Applied ML / Voice AI</div>

- Contributed to data processing, data generation, and model training for Kapture v3, an 11-language ASR model; the released system scored 21.9% strict WER across the 74,500-clip Vistaar benchmark, versus 28.3% for saaras:v3 and 29.0% for saaras:v4, and 17.3% versus 18.1% under Sarvam's normalizer.
- Release benchmarks, each scored with its official scorer on public test sets: 6.06 OI-WER on Voice Arena Monsoon Hindi (saaras:v3 6.79, saaras:v4 6.96), 13.1 WER on Vaani Hindi, and 5.54% WER averaged over the nine Open ASR Leaderboard English sets. Model card: [huggingface.co/fonada/kapture-v3](https://huggingface.co/fonada/kapture-v3).
- Ships on FonadaLabs as an upload-and-transcribe batch API: any-length audio up to 25MB across seven formats, long files decoded in parallel chunks with per-segment timestamps at ~60 ms median server time for a 2-second clip.
- Built and optimized a PyTorch noise-suppression pipeline for real-time audio, adding batched inference and evaluating latency/quality trade-offs for voice-bot workflows.
- Contributing to turn-taking for production voice bots: predicting when the system should listen, respond, or pause so telephony conversations stay natural.
</div>

## education

<div class="entry" markdown="1">
<div class="role"><strong>B.Tech, Computer Science and Engineering</strong><span class="muted">Sep 2021 – May 2025</span></div>
<div class="meta">DIT University, Dehradun · CGPA 8.49 / 10</div>
</div>

## skills

- **languages:** Python, Java, C++, SQL
- **ml / speech:** PyTorch, ONNX, scikit-learn, Pandas, NumPy
- **tools:** Git, Linux, Hugging Face Datasets, VS Code, Streamlit, Power BI

## certifications

- IBM Data Science Specialization (Coursera)
- Data Analysis with Python (freeCodeCamp)

## contact

- [{{ site.email }}](mailto:{{ site.email }})
- [LinkedIn]({{ site.linkedin_url }}) · [GitHub](https://github.com/{{ site.github_username }}) · [X](https://x.com/{{ site.x_username }})
