'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { wrapCaption } from '@/lib/editor.mjs';

type HeroId = 'cat' | 'dog' | 'seal';
type Work = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
};

const heroes: Array<{
  id: HeroId;
  player: string;
  name: string;
  note: string;
  image: string;
}> = [
  {
    id: 'cat',
    player: '01',
    name: '开粉车的橘猫',
    note: '平静脸 · 适合荒诞大场面',
    image: '/media/source.png',
  },
  {
    id: 'dog',
    player: '02',
    name: '种地的小白狗',
    note: '圆眼睛 · 适合白色食物和打工戏',
    image: '/media/source-dog.jpg',
  },
  {
    id: 'seal',
    player: '03',
    name: '白雪海豹公主',
    note: '黑宝石大眼睛 · 皇冠是本体',
    image: '/media/snow-seal-princess.png',
  },
];

const works: Record<HeroId, Work[]> = {
  cat: [
    {
      id: 'alien',
      title: '外星来客',
      subtitle: '接收不到地球信号',
      image: '/media/alien.png',
      tag: '变身',
    },
    {
      id: 'kiwi',
      title: '猕猴桃成精',
      subtitle: '一颗含猫量很高的水果',
      image: '/media/kiwi.png',
      tag: '食物',
    },
    {
      id: 'work',
      title: '不想上班',
      subtitle: '电脑和我都蓝屏了',
      image: '/media/work.png',
      tag: '场景',
    },
  ],
  dog: [
    {
      id: 'work-dog',
      title: '刚种完地又要上班',
      subtitle: '草帽还没摘，表格已经来了',
      image: '/media/work-dog.png',
      tag: '场景',
    },
    {
      id: 'bun-dog',
      title: '实心小狗馒头',
      subtitle: '按白毛和圆脸匹配，不硬套模板',
      image: '/media/bun-dog.png',
      tag: '食物',
    },
  ],
  seal: [],
};

export default function Home() {
  const [hero, setHero] = useState<HeroId | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [caption, setCaption] = useState('');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [guest, setGuest] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!work) return;
    setReady(false);
    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active || !canvas.current) return;
      const ctx = canvas.current.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 1024, 1024);
      const scale = Math.min(1024 / image.width, 1024 / image.height);
      ctx.drawImage(
        image,
        (1024 - image.width * scale) / 2,
        (1024 - image.height * scale) / 2,
        image.width * scale,
        image.height * scale,
      );
      const lines = wrapCaption(caption, 14).slice(0, 3);
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';
      ctx.font = 'bold 60px Arial, PingFang SC, sans-serif';
      ctx.lineWidth = 10;
      lines.forEach((line: string, i: number) => {
        const y = 965 - (lines.length - 1 - i) * 76;
        ctx.strokeStyle = '#151515';
        ctx.strokeText(line, 512, y, 950);
        ctx.fillStyle = '#fff';
        ctx.fillText(line, 512, y, 950);
      });
      setReady(true);
    };
    image.src = work.image;
    return () => {
      active = false;
    };
  }, [work, caption]);

  async function save() {
    if (!canvas.current || !ready || !work) return;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.current!.toBlob(resolve, 'image/png'),
    );
    if (!blob) return;
    const file = new File([blob], `${work.id}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        /* download below */
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setMessage('图片已经准备下载。');
  }

  function addGuest(file?: File) {
    if (!file) return;
    if (guest) URL.revokeObjectURL(guest);
    setGuest(URL.createObjectURL(file));
    setHero(null);
    setWork(null);
    setMessage(
      '已看到你家这位。网站负责展示，专属变身继续在 Codex 对话里生成。',
    );
  }

  function reset() {
    setHero(null);
    setWork(null);
    setCaption('');
    setMessage('');
  }

  return (
    <main className="desktop">
      <section className="window" aria-label="宠物变身效果演示">
        <header className="titlebar">
          <span>▧ PET_MEME.exe</span>
          <span aria-hidden="true">— □</span>
        </header>
        <nav className="toolbar">
          <button onClick={reset}>首页</button>
          <button onClick={() => input.current?.click()}>加入我的宠物</button>
          <small>效果展示版</small>
        </nav>
        <input
          ref={input}
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => addGuest(e.target.files?.[0])}
        />

        {!hero ? (
          <div className="content hero-screen">
            <p className="eyebrow">PET MEME CASTING · 选择角色</p>
            <h1>选择你的英雄</h1>
            <p className="subtitle">每只宠物，都有最适合自己的荒诞造型。</p>
            <div className="hero-grid">
              {heroes.map((item) => (
                <button
                  className={`hero-card hero-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setHero(item.id);
                    setMessage('');
                  }}
                >
                  <span className="hero-photo">
                    <img src={item.image} alt={item.name} />
                    <i>PLAYER {item.player}</i>
                  </span>
                  <strong>{item.name}</strong>
                  <small>{item.note}</small>
                  <b>选择这位 →</b>
                </button>
              ))}
              {guest && (
                <div className="hero-card guest-card">
                  <span className="hero-photo">
                    <img src={guest} alt="你选择的新宠物" />
                    <i>NEW HERO</i>
                  </span>
                  <strong>你家这位</strong>
                  <small>已加入候选席</small>
                  <b>在对话里继续变身</b>
                </div>
              )}
            </div>
            <button
              className="upload-hero"
              onClick={() => input.current?.click()}
            >
              ＋ 让你家宠物也入场
            </button>
            <p className="fineprint">
              网站是可玩的效果展；真正的专属图片由 Codex
              对话生成，不会用示例图冒充。
            </p>
          </div>
        ) : !work ? (
          <div className="content role-screen">
            <button className="back" onClick={() => setHero(null)}>
              ← 重选英雄
            </button>
            <div className="role-head">
              <img
                src={heroes.find((h) => h.id === hero)!.image}
                alt="已选英雄"
              />
              <div>
                <p>SELECTED HERO</p>
                <h2>{heroes.find((h) => h.id === hero)!.name}</h2>
                <small>{heroes.find((h) => h.id === hero)!.note}</small>
              </div>
            </div>
            <div className="section-title">
              <span>它适合演</span>
              <small>{works[hero].length} 个已完成造型</small>
            </div>
            {works[hero].length ? (
              <div className="work-grid">
                {works[hero].map((item) => (
                  <button
                    className="work-card"
                    key={item.id}
                    onClick={() => {
                      setWork(item);
                      setCaption('');
                      setMessage('');
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                    <span className="tag">{item.tag}</span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                    <b>查看成片 →</b>
                  </button>
                ))}
              </div>
            ) : (
              <div className="locked-role">
                <span>♛</span>
                <strong>公主造型正在解锁</strong>
                <p>
                  她刚刚加入英雄席。下一张专属成片会根据海豹的雪白绒毛、圆脸和皇冠来设计，不套用猫狗模板。
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="content result-screen">
            <button className="back" onClick={() => setWork(null)}>
              ← 返回造型
            </button>
            <div className="viewer-bar">
              <span>{work.id}.png</span>
              <small>已生成示例</small>
            </div>
            <canvas
              ref={canvas}
              width="1024"
              height="1024"
              aria-label={work.title}
            />
            <h2>{work.title}</h2>
            <p className="result-copy">{work.subtitle}</p>
            <label className="caption">
              <span>想说点什么（可选）</span>
              <textarea
                value={caption}
                maxLength={42}
                placeholder="例如：刚种完地又要写周报"
                onChange={(e) =>
                  setCaption(e.target.value.replace(/\r?\n/g, ' '))
                }
              />
            </label>
            <Button className="primary wide" disabled={!ready} onClick={save}>
              {ready ? '保存这张图 ↓' : '正在显影…'}
            </Button>
            <button className="make-own" onClick={() => input.current?.click()}>
              我也想让自己的宠物变成这样
            </button>
          </div>
        )}

        {message && (
          <p className="feedback" role="status">
            {message}
          </p>
        )}
        <footer className="status">
          <span>● READY</span>
          <span>Made with Codex conversation</span>
        </footer>
      </section>
      <p className="desktop-note">它还是它，只是终于演上了。</p>
    </main>
  );
}
