/* GujPsych-Screen (ગુજસાઇક-સ્ક્રીન)
  scales.js — Single source of truth for all scale listings.
*/

const SCALES = [

  // ── MOOD & ANXIETY ────────────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/phq9.html',
    abbr:      'PHQ-9',
    name:      'દર્દીના સ્વાસ્થ્ય માટે પ્રશ્નાવલી – ૯',
    desc:      'ડિપ્રેશનના લક્ષણો માપતી ૯ પ્રશ્નોની સ્ક્રીનિંગ પ્રશ્નાવલિ.',
    items:     '૯ પ્રશ્નો',
    construct: 'ડિપ્રેશન',
    time:      '~૩ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/gad7.html',
    abbr:      'GAD-7',
    name:      'સામાન્ય ચિંતા વિકૃતિ – ૭',
    desc:      'ચિંતા (Anxiety) ના લક્ષણો માપતી ૭ પ્રશ્નોની પ્રશ્નાવલિ.',
    items:     '૭ પ્રશ્નો',
    construct: 'ચિંતા',
    time:      '~૨ મિનિટ',
  },

  // ── LONELINESS & SOCIAL ───────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/mspss.html',
    abbr:      'MSPSS',
    name:      'સામાજિક સહાય માપદંડ',
    desc:      'Multidimensional Scale of Perceived Social Support — પરિવાર, મિત્રો અને અન્ય.',
    items:     '૧૨ પ્રશ્નો',
    construct: 'સામાજિક સહાય',
    time:      '~૩ મિનિટ',
  },

  // ── SELF & WELLBEING ──────────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/rse.html',
    abbr:      'RSES',
    name:      'રોઝનબર્ગ સ્વ-સન્માન માપ',
    desc:      'Rosenberg Self-Esteem Scale — સ્વ-સન્માન (Self-Esteem) માટે.',
    items:     '૧૦ પ્રશ્નો',
    construct: 'સ્વ-સન્માન',
    time:      '~૨ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/SWBS.html',
    abbr:      'SWBS',
    name:      'આધ્યાત્મિક સુખાકારી માપદંડ',
    desc:      'Spiritual Well-Being Scale — અસ્તિત્વ અને ધાર્મિક સુખાકારી.',
    items:     '૨૦ પ્રશ્નો',
    construct: 'સુખ-સમૃદ્ધિ',
    time:      '~૫ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/whoqol.html',
    abbr:      'WHOQOL-BREF',
    name:      'જીવન ગુણવત્તા માપદંડ',
    desc:      'WHO Quality of Life — જીવનની ગુણવત્તાના વિવિધ આયામો.',
    items:     '૨૬ પ્રશ્નો',
    construct: 'જીવન ગુણવત્તા',
    time:      '~૮ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/WHO5WBI.html',
    abbr:      'WHO-5',
    name:      'WHO-5 સુખાકારી સૂચકાંક',
    desc:      'WHO-5 Well-Being Index — માનસિક સુખાકારી માપવા માટે.',
    items:     '૫ પ્રશ્નો',
    construct: 'સુખ-સમૃદ્ધિ',
    time:      '~૨ મિનિટ',
  },

  // ── METACOGNITION & EMOTION ───────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/mcq30.html',
    abbr:      'MCQ-30',
    name:      'મેટા-કોગ્નિટિવ પ્રશ્નાવલિ – ૩૦',
    desc:      'Metacognitions Questionnaire — વિચારો વિષેની માન્યતાઓ.',
    items:     '૩૦ પ્રશ્નો',
    construct: 'મેટા-કોગ્નિશન',
    time:      '~૭ મિનિટ',
  },

  // ── RELATIONSHIPS & PARENTING ─────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/Kmss.html',
    abbr:      'KMSS',
    name:      'કેન્સાસ વૈવાહિક સંતોષ માપ',
    desc:      'Kansas Marital Satisfaction Scale — વૈવાહિક સંતોષ.',
    items:     '૩ પ્રશ્નો',
    construct: 'વૈવાહિક સંતોષ',
    time:      '~૧ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/Rs10.html',
    abbr:      'RS-10',
    name:      'સંબંધ સંતોષ માપ',
    desc:      'Relationship Satisfaction Scale — સામાન્ય સંબંધ સંતોષ.',
    items:     '૧૦ પ્રશ્નો',
    construct: 'સંબંધ સંતોષ',
    time:      '~૩ મિનિટ',
  },

  // ── COPING & RESILIENCE ───────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/BriefCOPE.html',
    abbr:      'Brief COPE',
    name:      'સંક્ષિપ્ત સામનો માપ',
    desc:      'Brief COPE — તણાવ સામે સામનો (Coping) કરવાની પ્રવૃત્તિઓ.',
    items:     '૨૮ પ્રશ્નો',
    construct: 'સામનો',
    time:      '~૬ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/PSS10.html',
    abbr:      'PSS-10',
    name:      'અનુભવેલ તણાવ માપદંડ',
    desc:      'Perceived Stress Scale — જીવનના તણાવની સમજ.',
    items:     '૧૦ પ્રશ્નો',
    construct: 'તણાવ',
    time:      '~૩ મિનિટ',
  },

  // ── SUBSTANCE USE ─────────────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/FTND.html',
    abbr:      'Fagerström',
    name:      'ફૅગરસ્ટ્રૉમ તમાકુ નિર્ભરતા',
    desc:      'Fagerström Test for Nicotine Dependence — તમાકુ નિર્ભરતા.',
    items:     '૬ પ્રશ્નો',
    construct: 'તમાકુ',
    time:      '~૨ મિનિટ',
  },
  {
    status:    'live',
    file:      'scales_folder/SADQ.html',
    abbr:      'SADQ',
    name:      'દારૂ નિર્ભરતા પ્રશ્નાવલિ',
    desc:      'Severity of Alcohol Dependence Questionnaire — દારૂ નિર્ભરતા.',
    items:     '૨૦ પ્રશ્નો',
    construct: 'દારૂ',
    time:      '~૫ મિનિટ',
  },

  // ── TECHNOLOGY ───────────────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/NMPQ.html',
    abbr:      'NMP-Q',
    name:      'નોમોફોબિયા પ્રશ્નાવલિ',
    desc:      'Nomophobia Questionnaire — ફોન વિના ન રહી શકવાની ભાવના.',
    items:     '૨૦ પ્રશ્નો',
    construct: 'નોમોફોબિયા',
    time:      '~૪ મિનિટ',
  },

  // ── OCCUPATIONAL ──────────────────────────────────────────────
  {
    status:    'live',
    file:      'scales_folder/wwq.html',
    abbr:      'WWQ',
    name:      'કાર્યસ્થળ સુખાકારી પ્રશ્નાવલિ',
    desc:      'Workplace Well-being Questionnaire — કાર્યસ્થળ પરના અનુભવો.',
    items:     '—',
    construct: 'વ્યાવસાયિક સુખાકારી',
    time:      '~૫ મિનિટ',
  }
];