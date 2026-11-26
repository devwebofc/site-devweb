import React, { useState, useEffect, useRef } from 'react';
import styles from './ServicesSection.module.css';

interface ServicesSectionProps {
  onOpenBriefing?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBriefing }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const mocksRef = useRef<HTMLDivElement>(null);

  // No celular os mockups são desenhados em 300px de largura e reduzidos por inteiro,
  // mantendo as proporções (o texto encolhe junto, sem se sobrepor)
  useEffect(() => {
    const el = mocksRef.current;
    if (!el) return;
    const update = () => el.style.setProperty('--k', String(el.clientWidth / 300));
    update();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Interactive mock states
  const [instTab, setInstTab] = useState<'inicio' | 'sobre' | 'servicos' | 'contato'>('inicio');
  const [landingClickCount, setLandingClickCount] = useState(48);
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '1a'>('30d');
  const [activeKpi, setActiveKpi] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const upd = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current) {
            const r = sectionRef.current.getBoundingClientRect();
            const h = sectionRef.current.offsetHeight - window.innerHeight;
            if (h > 0) {
              const p = Math.min(Math.max(-r.top / h, 0), 0.999);
              const idx = Math.floor(p * 3);
              setActiveIndex(idx);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();

    return () => {
      window.removeEventListener('scroll', upd);
      window.removeEventListener('resize', upd);
    };
  }, []);

  const handleDotClick = (i: number) => {
    if (sectionRef.current) {
      const h = sectionRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: sectionRef.current.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / 3) * h,
        behavior: 'smooth',
      });
    }
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onOpenBriefing) {
      e.preventDefault();
      onOpenBriefing();
    }
  };

  // Text Split Animation Helper
  const renderSplitText = (text: string, baseDelay: number = 0) => {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span
        key={i}
        className={styles.splitWord}
        style={{ animationDelay: `${baseDelay + i * 35}ms` }}
      >
        {word}{i < words.length - 1 ? '\u00A0' : ''}
      </span>
    ));
  };

  // 1. Interactive Mock for Landing Page
  const renderLandingMock = () => (
    <div className={styles.mockLanding}>
      <div className={styles.browserHeader}>
        <div className={styles.browserDots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.browserUrl}>devweb.tech/oferta-exclusiva</div>
      </div>

      <div className={styles.landingBody}>
        {/* Floating conversion badge */}
        <div
          className={styles.liveConversionBadge}
          onClick={() => setLandingClickCount((c) => c + 1)}
          title="Clique para simular conversão"
        >
          <span className={styles.badgePulse} />
          <span>+{landingClickCount}% Conversões</span>
        </div>

        <div className={styles.landingHeroHeadline}>
          Aumente em até 3x os contatos de clientes no WhatsApp
        </div>

        <div className={styles.landingPillsRow}>
          <span className={styles.landingPill}>⚡ Carga &lt; 0.8s</span>
          <span className={styles.landingPill}>📱 Mobile-First</span>
          <span className={styles.landingPill}>🎯 Pixel Meta/Google</span>
        </div>

        {/* Interactive lead form */}
        <div className={styles.landingInteractiveCard}>
          <div className={styles.landingInputMock}>
            <span>Seu nome ou empresa...</span>
          </div>
          <button
            type="button"
            className={styles.landingBtnMock}
            onClick={() => setLandingClickCount((c) => c + 1)}
          >
            Quero meu orçamento ➜
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Interactive Mock for Site Institucional
  const renderInstitucionalMock = () => (
    <div className={styles.mockInstitucional}>
      <div className={styles.browserHeader}>
        <div className={styles.browserDots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.browserUrl}>suaempresa.com.br</div>
      </div>

      {/* Clickable Navigation Tabs */}
      <div className={styles.instNavTabs}>
        <span
          className={`${styles.instTab} ${instTab === 'inicio' ? styles.activeTab : ''}`}
          onClick={() => setInstTab('inicio')}
        >
          Início
        </span>
        <span
          className={`${styles.instTab} ${instTab === 'sobre' ? styles.activeTab : ''}`}
          onClick={() => setInstTab('sobre')}
        >
          Sobre
        </span>
        <span
          className={`${styles.instTab} ${instTab === 'servicos' ? styles.activeTab : ''}`}
          onClick={() => setInstTab('servicos')}
        >
          Serviços
        </span>
        <span
          className={`${styles.instTab} ${instTab === 'contato' ? styles.activeTab : ''}`}
          onClick={() => setInstTab('contato')}
        >
          Contato
        </span>
      </div>

      <div className={styles.instBody}>
        {/* Dynamic content based on tab */}
        <div className={styles.instStatsGrid}>
          <div className={styles.instStatBox}>
            <span className={styles.instStatNumber}>
              {instTab === 'servicos' ? '14+' : instTab === 'sobre' ? '12 anos' : '98%'}
            </span>
            <span className={styles.instStatLabel}>
              {instTab === 'servicos' ? 'Serviços ativos' : instTab === 'sobre' ? 'Tradição' : 'Satisfação'}
            </span>
          </div>
          <div className={styles.instStatBox}>
            <span className={styles.instStatNumber}>
              {instTab === 'contato' ? '08:00 - 18h' : '1.200+'}
            </span>
            <span className={styles.instStatLabel}>
              {instTab === 'contato' ? 'Atendimento' : 'Clientes atendidos'}
            </span>
          </div>
        </div>

        <div className={styles.instCardsGrid}>
          <div className={styles.instFeatureCard}>
            <div className={styles.instCardBar} />
            <span style={{ fontSize: '10px', color: '#D1D5DB' }}>
              {instTab === 'sobre' ? 'Nossa História' : 'Autoridade de Marca'}
            </span>
          </div>
          <div className={styles.instFeatureCard}>
            <div className={styles.instCardBar} style={{ background: '#E82824' }} />
            <span style={{ fontSize: '10px', color: '#D1D5DB' }}>
              {instTab === 'servicos' ? 'Metodologia' : 'Presença Sólida'}
            </span>
          </div>
        </div>

        <div className={styles.instSeoBadge}>
          <span>🟢 Google Top #1</span>
          <span style={{ fontSize: '8.5px', color: '#6EE7B7' }}>Indexado com SEO</span>
        </div>
      </div>
    </div>
  );

  // 3. Interactive Mock for Sistemas Web
  const renderDashboardMock = () => {
    // Dynamic chart paths based on period
    const chartPaths = {
      '7d': '0,32 20,24 40,28 60,14 80,18 100,6',
      '30d': '0,28 18,22 34,25 52,12 70,15 100,3',
      '1a': '0,30 25,18 50,22 75,10 100,2',
    };

    return (
      <div className={styles.mockDashboard}>
        <div className={styles.dashSidebar}>
          <div className={`${styles.dashSideItem} ${styles.activeSideItem}`} />
          <div className={styles.dashSideItem} />
          <div className={styles.dashSideItem} />
          <div className={styles.dashSideItem} />
        </div>

        <div className={styles.dashMain}>
          <div className={styles.dashKpiRow}>
            <div
              className={`${styles.dashKpiCard} ${activeKpi === 0 ? styles.activeKpi : ''}`}
              onClick={() => setActiveKpi(0)}
            >
              <div className={styles.dashKpiValue}>R$ 48k</div>
              <div className={styles.dashKpiLabel}>Vendas</div>
            </div>
            <div
              className={`${styles.dashKpiCard} ${activeKpi === 1 ? styles.activeKpi : ''}`}
              onClick={() => setActiveKpi(1)}
            >
              <div className={styles.dashKpiValue}>+142</div>
              <div className={styles.dashKpiLabel}>Agendados</div>
            </div>
            <div
              className={`${styles.dashKpiCard} ${activeKpi === 2 ? styles.activeKpi : ''}`}
              onClick={() => setActiveKpi(2)}
            >
              <div className={styles.dashKpiValue}>99.8%</div>
              <div className={styles.dashKpiLabel}>Uptime</div>
            </div>
          </div>

          <div className={styles.dashChartWrap}>
            <div className={styles.dashChartHeader}>
              <span>Métricas em Tempo Real</span>
              <div className={styles.dashChartToggle}>
                <span
                  className={chartPeriod === '7d' ? styles.active : ''}
                  onClick={() => setChartPeriod('7d')}
                >
                  7D
                </span>
                <span
                  className={chartPeriod === '30d' ? styles.active : ''}
                  onClick={() => setChartPeriod('30d')}
                >
                  30D
                </span>
                <span
                  className={chartPeriod === '1a' ? styles.active : ''}
                  onClick={() => setChartPeriod('1a')}
                >
                  1A
                </span>
              </div>
            </div>

            <svg viewBox="0 0 100 36" preserveAspectRatio="none">
              <polyline
                points={chartPaths[chartPeriod]}
                fill="none"
                stroke="#F14895"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={styles.dashRowsList}>
            <div className={styles.dashRowItem}>
              <div className={styles.dashRowAvatar} />
              <div className={styles.dashRowBar} />
              <div className={styles.dashRowBadge} />
            </div>
            <div className={styles.dashRowItem}>
              <div className={styles.dashRowAvatar} />
              <div className={styles.dashRowBar} />
              <div className={styles.dashRowBadge} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="servicos" className={styles.servicos} ref={sectionRef}>
      <div className={styles.sc}>
        {/* Eyebrow Header */}
        <div className={styles.ey}>O que construímos para o seu negócio</div>

        {/* 3-Part Horizontal Composition */}
        <div className={styles.stage}>
          {/* Left Column: Titles with Text Split Animation */}
          <div className={styles.colLeft}>
            <div className={styles.stack}>
              <div className={`${styles.st} ${activeIndex === 0 ? styles.on : ''}`}>
                <h2>
                  <span key={`t0-${activeIndex === 0}`}>
                    {renderSplitText('landing', 0)}
                    <br />
                    {renderSplitText('pages', 70)}
                  </span>
                </h2>
              </div>
              <div className={`${styles.st} ${activeIndex === 1 ? styles.on : ''}`}>
                <h2 className={styles.longTitle}>
                  <span key={`t1-${activeIndex === 1}`}>
                    {renderSplitText('sites', 0)}
                    <br />
                    {renderSplitText('institucionais', 70)}
                  </span>
                </h2>
              </div>
              <div className={`${styles.st} ${activeIndex === 2 ? styles.on : ''}`}>
                <h2>
                  <span key={`t2-${activeIndex === 2}`}>
                    {renderSplitText('sistemas', 0)}
                    <br />
                    {renderSplitText('web', 70)}
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Center Column: Tall Rounded Interactive Card */}
          <div className={styles.colCenter}>
            <div className={styles.cds} ref={mocksRef}>
              <div className={`${styles.cd} ${activeIndex === 0 ? styles.on : ''}`}>
                {renderLandingMock()}
              </div>
              <div className={`${styles.cd} ${activeIndex === 1 ? styles.on : ''}`}>
                {renderInstitucionalMock()}
              </div>
              <div className={`${styles.cd} ${activeIndex === 2 ? styles.on : ''}`}>
                {renderDashboardMock()}
              </div>
            </div>
          </div>

          {/* Right Column: Description with Text Split, Advantages & CTA Button */}
          <div className={styles.colRight}>
            <div className={styles.stack}>
              <div className={`${styles.st} ${activeIndex === 0 ? styles.on : ''}`}>
                <p className={styles.desc}>
                  <span key={`d0-${activeIndex === 0}`}>
                    {renderSplitText(
                      'Uma página única, focada em uma oferta, feita para o visitante entrar em contato.',
                      80
                    )}
                  </span>
                </p>
                <p className={styles.price}>
                  <b>R$ 790</b>
                  <span>em até 2x no cartão</span>
                </p>
                <ul className={styles.advList}>
                  <li>Carregamento rápido</li>
                  <li>Leitura perfeita no celular</li>
                  <li>Pronta para campanhas no Instagram e no Google</li>
                </ul>
              </div>

              <div className={`${styles.st} ${activeIndex === 1 ? styles.on : ''}`}>
                <p className={styles.desc}>
                  <span key={`d1-${activeIndex === 1}`}>
                    {renderSplitText(
                      'Um site com várias páginas que apresenta a sua empresa, os seus serviços e a sua história.',
                      80
                    )}
                  </span>
                </p>
                <p className={styles.price}>
                  <b>R$ 990</b>
                  <span>em até 2x no cartão</span>
                </p>
                <ul className={styles.advList}>
                  <li>Mais credibilidade para a sua marca</li>
                  <li>Estrutura pensada para aparecer nas buscas</li>
                  <li>Você atualiza textos e fotos sem depender de ninguém</li>
                </ul>
              </div>

              <div className={`${styles.st} ${activeIndex === 2 ? styles.on : ''}`}>
                <p className={styles.desc}>
                  <span key={`d2-${activeIndex === 2}`}>
                    {renderSplitText(
                      'Um sistema que roda no navegador e organiza a rotina do seu negócio em um só lugar.',
                      80
                    )}
                  </span>
                </p>
                <p className={styles.price}>
                  <b>Sob consulta</b>
                </p>
                <ul className={styles.advList}>
                  <li>Cadastros, agendamentos e relatórios centralizados</li>
                  <li>Acesso pelo computador ou pelo celular</li>
                  <li>Feito sob medida para o seu processo</li>
                </ul>
              </div>
            </div>

            <a className={styles.btn} href="#briefing" onClick={handleCtaClick}>
              Pedir orçamento
            </a>
          </div>
        </div>

        {/* Floating Vertical Dots Capsule Indicator */}
        <div className={styles.dts} role="tablist" aria-label="Serviços">
          <button
            type="button"
            className={`${styles.dt} ${activeIndex === 0 ? styles.on : ''}`}
            aria-label="Landing pages"
            title="Landing pages"
            aria-selected={activeIndex === 0}
            onClick={() => handleDotClick(0)}
          />
          <button
            type="button"
            className={`${styles.dt} ${activeIndex === 1 ? styles.on : ''}`}
            aria-label="Sites institucionais"
            title="Sites institucionais"
            aria-selected={activeIndex === 1}
            onClick={() => handleDotClick(1)}
          />
          <button
            type="button"
            className={`${styles.dt} ${activeIndex === 2 ? styles.on : ''}`}
            aria-label="Sistemas web"
            title="Sistemas web"
            aria-selected={activeIndex === 2}
            onClick={() => handleDotClick(2)}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
