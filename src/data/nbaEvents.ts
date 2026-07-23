import { CareerEvent } from '../types/game';

export const CAREER_EVENTS: CareerEvent[] = [
  // 1. HIGH-STAKES RISKY GAME 7 PLAYOFF DECISION
  {
    id: 'event_playoff_injury_risk',
    title: '¿JUGAR LESIONADO EL PARTIDO 7 DE FINALES?',
    stage: 'prime',
    category: 'on_court',
    description: 'Sufriste una torcedura de tobillo de grado 2 en el Partido 6 de Finales NBA. El cuerpo médico te sugiere no jugar, pero la serie está 3-3 y la ciudad exige el campeonato.',
    choices: [
      {
        id: 'choice_play_infiltrated',
        text: '💉 Infiltrarse y jugar con dolor (Riesgo Alto)',
        description: 'Te infiltras analgésicos para salir a darlo todo por el anillo.',
        isRisky: true,
        successProbability: 0.65,
        successOutcome: {
          narrativeOutcome: '¡ACTUACIÓN HEROICA! Anotaste 34 puntos y ganaste el Anillo de Campeón NBA 💍. Te coronas MVP de las Finales.',
          statChanges: { clutch: 10, reputation: 20, marketability: 25 },
          unlockedBadge: '🔥 Leyenda Infiltrada',
        },
        failureOutcome: {
          narrativeOutcome: '¡RECAÍDA GRAVE! El tobillo cedió en el 3er cuarto y sufriste un esguince severo. Perdiste el título y pierdes velocidad.',
          statChanges: { athletic: -6, durability: -8, reputation: -5 },
        },
      },
      {
        id: 'choice_rest_protect',
        text: '🩺 Proteger tu cuerpo y no jugar',
        description: 'Decides priorizar tu carrera a largo plazo y ver el partido desde el banquillo.',
        narrativeOutcome: 'Tu equipo cayó luchando en el Partido 7. La prensa local cuestionó tu falta de entrega, pero tu físico quedó intácto.',
        statChanges: { reputation: -8, durability: +4 },
      },
    ],
  },

  // 2. CRYPTO / UNVERIFIED TECH STARTUP INVESTMENT
  {
    id: 'event_crypto_startup_deal',
    title: 'OPORTUNIDAD DE INVERSIÓN EN STARTUP DE IA/CRIPTOMONEDAS',
    stage: 'any',
    category: 'lifestyle',
    description: 'Un influyente grupo de inversores te propone inyectar $2M USD en una incipiente startup tech. Si despega, cuadruplicas tu fortuna; si falla, pierdes la inversión.',
    choices: [
      {
        id: 'choice_invest_risky',
        text: '🚀 Invertir $2M USD en la Startup (Riesgo 50/50)',
        description: 'Apuestas una porción de tus ganancias en una startup de alto riesgo.',
        isRisky: true,
        successProbability: 0.50,
        successOutcome: {
          narrativeOutcome: '¡ÉXITO ROTUNDO! La startup salió a bolsa y tu inversión se multiplicó por 4. Obtienes +$8M USD y gran reputación en Wall Street.',
          statChanges: { earningsMillions: 8, marketability: 18 },
          unlockedBadge: '🚀 Magnate de Silicon Valley',
        },
        failureOutcome: {
          narrativeOutcome: '¡FRACASO Y ESTAFA! La startup se declaró en quiebra y la SEC investigó el proyecto. Perdiste tus $2M USD.',
          statChanges: { earningsMillions: -2, reputation: -10 },
        },
      },
      {
        id: 'choice_decline_tech',
        text: '🛡️ Recharar y mantener tus fondos seguros',
        description: 'Prefieres no arriesgar tu fortuna en negocios no verificados.',
        narrativeOutcome: 'Decidiste mantener tus fondos en instrumentos seguros sin sorpresas.',
        statChanges: { reputation: +2 },
      },
    ],
  },

  // 3. SUMMER PRIVATE BOOTCAMP IN BLACK OPS
  {
    id: 'event_black_ops_bootcamp',
    title: 'CAMPAMENTO SECRETOS DE VERANO CON LEYENDAS HOF',
    stage: 'any',
    category: 'offseason',
    description: 'Un famoso entrenador de tiro te ofrece un campamento exclusivo de 6 semanas en las montañas para remodelar tu mecánica de tiro.',
    choices: [
      {
        id: 'choice_intense_bootcamp',
        text: '🏋️ Entrenar a máxima intensidad (Riesgo de Fatiga)',
        description: 'Trabajas 3 sesiones al día para llevar tu tiro al siguiente nivel.',
        isRisky: true,
        successProbability: 0.70,
        successOutcome: {
          narrativeOutcome: '¡EVOLUCIÓN TÁCTICA! Tu tiro de 3 puntos y media distancia mejoraron drásticamente (+6 OVR Tiro).',
          statChanges: { shooting3P: 6, shootingMid: 5 },
          unlockedBadge: '🎯 Tirador Frío',
        },
        failureOutcome: {
          narrativeOutcome: '¡SOBRETRENO! Sufriste fascitis plantar por sobrecarga muscular y llegas mermado a la pretemporada.',
          statChanges: { athletic: -4, durability: -5 },
        },
      },
      {
        id: 'choice_normal_offseason',
        text: '🏖️ Vacaciones familiares y entrenamiento moderado',
        description: 'Descansas adecuadamente y llegas fresco al Training Camp.',
        narrativeOutcome: 'Tu cuerpo descansó completamente y estás al 100% de energía.',
        statChanges: { durability: +3 },
      },
    ],
  },

  // 4. CONTROVERSIAL PODCAST INTERVIEW
  {
    id: 'event_controversial_podcast',
    title: 'ENTREVISTA SIN FILTRO EN PODCAST VIRAL',
    stage: 'any',
    category: 'media',
    description: 'Un polémico creador de contenido te invita a un podcast en vivo donde te pregunta sobre el vestuario y la gerencia de tu equipo.',
    choices: [
      {
        id: 'choice_speak_raw_truth',
        text: '🔥 Hablar sin filtro y criticar a la gerencia (Riesgo Alto)',
        description: 'Dices exactamente lo que piensas sobre la falta de refuerzos.',
        isRisky: true,
        successProbability: 0.45,
        successOutcome: {
          narrativeOutcome: '¡VIRAL EN REDES! El público aplaudió tu honestidad brutal y forzaste a la gerencia a realizar traspasos.',
          statChanges: { marketability: 20, reputation: 12 },
          unlockedBadge: '🎤 Portavoz de los Fans',
        },
        failureOutcome: {
          narrativeOutcome: '¡MULTA Y VESTUARIO ROTO! La gerencia te multó con $250k y tus compañeros se distanciaron.',
          statChanges: { reputation: -18, earningsMillions: -0.25 },
        },
      },
      {
        id: 'choice_politically_correct',
        text: '🤐 Dar respuestas diplomáticas y respetuosas',
        description: 'Evitas la polémica y proteges la química de vestuario.',
        narrativeOutcome: 'Mantuviste el profesionalismo perfecto y la gerencia valoró tu lealtad.',
        statChanges: { reputation: +6 },
      },
    ],
  },
];
