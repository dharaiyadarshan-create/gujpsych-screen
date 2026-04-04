/**
 * GujPsych-Screen (ગુજસાઇક-સ્ક્રીન)
 * sociodem.js — Sociodemographic Form Module
 *
 * Usage:
 *   SocioDem.render('container-id')             // uses 'generic' by default
 *   SocioDem.render('container-id', 'college')  // uses college variant
 *   SocioDem.isComplete() → boolean
 *   SocioDem.getData()    → object or null
 *   SocioDem.reset()
 * 
 * Form FIELDS:
 * GENERIC_FIELDS-age,gender,marital_status,residence
 * OCCUPATION_NON_STUDENT_FIELDS- from kupasswamy
 * EDUCATION_NON_STUDENT_FIELDS- list of education levels
 * COURSE_MAP- drop down to select education
 * COLLEGE_FIELDS- college name, type, stream, course, year of study
 * GUJARAT_DISTRICTS-district dropdown  
 * perinatal fields will be added in a later version, so not included here
 * caregiver fields will be added in a later version, so not included here
 * marital status in in general fields
 * 
 */

const SocioDem = (() => {

  // ── COURSE MAP (stream → courses) ────────────────────────────────
  const COURSE_MAP = {
    1: [ // Arts
      { label: 'BA',            value: 'BA' },
      { label: 'MA',            value: 'MA' },
      { label: 'BFA',           value: 'BFA' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    2: [ // Science
      { label: 'BSc',           value: 'BSc' },
      { label: 'MSc',           value: 'MSc' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    3: [ // Commerce
      { label: 'BCom',          value: 'BCom' },
      { label: 'MCom',          value: 'MCom' },
      { label: 'BBA',           value: 'BBA' },
      { label: 'MBA',           value: 'MBA' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    4: [ // Engineering / Technology
      { label: 'BE / BTech',    value: 'BE_BTech' },
      { label: 'ME / MTech',    value: 'ME_MTech' },
      { label: 'Diploma',       value: 'Diploma' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    5: [ // Medical / Paramedical
      { label: 'MBBS',          value: 'MBBS' },
      { label: 'BDS',           value: 'BDS' },
      { label: 'BAMS',          value: 'BAMS' },
      { label: 'BHMS',          value: 'BHMS' },
      { label: 'BPharm',        value: 'BPharm' },
      { label: 'BSc Nursing',   value: 'BSc_Nursing' },
      { label: 'Paramedical',   value: 'Paramedical' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    6: [ // Law
      { label: 'LLB',           value: 'LLB' },
      { label: 'LLM',           value: 'LLM' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    7: [ // Education
      { label: 'BEd',           value: 'BEd' },
      { label: 'MEd',           value: 'MEd' },
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
    8: [ // Other stream
      { label: 'અન્ય (Other)',  value: '__other__' },
    ],
  };

  // ── GUJARAT DISTRICTS ────────────────────────────────────────────
  const GUJARAT_DISTRICTS = [
    'અમદાવાદ (Ahmedabad)',
    'અમરેલી (Amreli)',
    'આણંદ (Anand)',
    'અરવલ્લી (Aravalli)',
    'બનાસકાંઠા (Banaskantha)',
    'ભરૂચ (Bharuch)',
    'ભાવનગર (Bhavnagar)',
    'બોટાદ (Botad)',
    'છોટા ઉદેપુર (Chhota Udaipur)',
    'દાહોદ (Dahod)',
    'ડાંગ (Dang)',
    'દેવભૂમિ દ્વારકા (Devbhoomi Dwarka)',
    'ગાંધીનગર (Gandhinagar)',
    'ગીર સોમનાથ (Gir Somnath)',
    'જામનગર (Jamnagar)',
    'જૂનાગઢ (Junagadh)',
    'ખેડા (Kheda)',
    'કચ્છ (Kutch)',
    'મહીસાગર (Mahisagar)',
    'મહેસાણા (Mehsana)',
    'મોરબી (Morbi)',
    'નર્મદા (Narmada)',
    'નવસારી (Navsari)',
    'પંચમહાલ (Panchmahal)',
    'પાટણ (Patan)',
    'પોરબંદર (Porbandar)',
    'રાજકોટ (Rajkot)',
    'સાબરકાંઠા (Sabarkantha)',
    'સુરત (Surat)',
    'સુરેન્દ્રનગર (Surendranagar)',
    'તાપી (Tapi)',
    'વડોદરા (Vadodara)',
    'વલસાડ (Valsad)',
  ];

  // ── GENERIC FIELDS ───────────────────────────────────────────────
  const GENERIC_FIELDS = [

    { section: 'A. સામાન્ય માહિતી · General' },

    {
      id: 'age', type: 'number',
      label: 'ઉંમર (Age)',
      sublabel: 'પૂર્ણ વર્ષોમાં · Completed years',
      min: 18, max: 70, required: true
    },
    {
      id: 'gender', type: 'radio',
      label: 'લિંગ (Gender)', required: true,
      options: [
        { label: 'પુરુષ (Male)',    value: 1 },
        { label: 'સ્ત્રી (Female)', value: 2 },
        { label: 'અન્ય (Other)',    value: 3 },
      ]
    },
    {
      id: 'marital_status', type: 'radio',
      label: 'વૈવાહિક સ્થિતિ (Marital Status)', required: true,
      options: [
        { label: 'અવિવાહિત (Unmarried)',          value: 1 },
        { label: 'વિવાહિત (Married)',              value: 2 },
        { label: 'છૂટાછેડા (Divorced/Separated)', value: 3 },
        { label: 'વિધવા / વિધુર (Widowed)',        value: 4 },
      ]
    },
    {
      id: 'residence', type: 'radio',
      label: 'વસવાટ (Residence)', required: true,
      options: [
        { label: 'શહેરી (Urban)',           value: 1 },
        { label: 'ગ્રામ્ય (Rural)',          value: 2 },
        { label: 'અર્ધ-શહેરી (Semi-urban)', value: 3 },
      ]
    }];

    const EDUCATION_NON_STUDENT_FIELDS = [

    { section: 'B. શિક્ષણ અને વ્યવસાય · Education & Occupation' },

    {
      id: 'education', type: 'radio',
      label: 'શિક્ષણ (Education)',
      sublabel: 'સર્વોચ્ચ પૂર્ણ · Highest completed', required: true,
      options: [
        { label: 'નિરક્ષર / પ્રાથમિક ધો. ૧–૪',  value: 1 },
        { label: 'માધ્યમિક ધો. ૫–૭',             value: 2 },
        { label: 'હાઈસ્કૂલ ધો. ૮–૧૦',            value: 3 },
        { label: 'ધો. ૧૨ (Higher Secondary)',      value: 4 },
        { label: 'ડિપ્લોમા / ૧૨ પછીનું',          value: 5 },
        { label: 'સ્નાતક (Graduate)',              value: 6 },
        { label: 'અનુસ્નાતક (Postgraduate)',       value: 7 },
        { label: 'પીએચ.ડી. (PhD)',                value: 8 },
      ]
    },];

    const OCCUPATION_NON_STUDENT_FIELDS = [
    {
      id: 'occupation', type: 'radio',
      label: 'વ્યવસાય (Occupation)', required: true,
      options: [
        { label: 'વ્યાવસાયિક / ઉચ્ચ અધિકારી (Professional / Senior Official)',     value: 1 },
        { label: 'ટેક્નિશિયન / શિક્ષક / નર્સ (Technician / Teacher / Nurse)',        value: 2 },
        { label: 'કચેરી કર્મચારી (Clerk / Office worker)',                          value: 3 },
        { label: 'વેપાર (Skilled worker / Sales)',                                value: 4 },
        { label: 'મજૂર (Unskilled labour)',                                      value: 5 },
        { label: 'કૃષિ (Agriculture)',                                            value: 6 },
        { label: 'ગૃહિણી (Homemaker)',                                          value: 7 },
        { label: 'વિદ્યાર્થી (Student)',                                            value: 8 },
        { label: 'બેરોજગાર (Unemployed)',                                        value: 9 },
      ]
    }];

  // ── COLLEGE FIELDS ───────────────────────────────────────────────
  const COLLEGE_FIELDS = [

    { section: 'A. કૉલેજ માહિતી · College Information' },

    {
      id: 'college_name', type: 'text',
      label: 'કૉલેજનું નામ (College Name)',
      sublabel: 'સંપૂર્ણ સત્તાવાર નામ · Full official name',
      placeholder: 'દા.ત. Government Science College, Ahmedabad',
      required: true
    },
    {
      id: 'college_district', type: 'dropdown',
      label: 'કૉલેજનો જિલ્લો (District of College)',
      sublabel: 'જ્યાં કૉલેજ આવેલી છે · Where the college is located',
      options: GUJARAT_DISTRICTS,
      required: true
    },
    {
      id: 'college_type', type: 'radio',
      label: 'કૉલેજનો પ્રકાર (Type of College)', required: true,
      options: [
        { label: 'સરકારી (Government)',    value: 1 },
        { label: 'અર્ધસરકારી (Semi-Government)',        value: 2 },
        { label: 'ખાનગી  (private)', value: 3 },
      ]
    },

    { section: 'B. અભ્યાસ · Course Details' },

    {
      id: 'stream', type: 'radio',
      label: 'પ્રવાહ (Stream)', required: true,
      options: [
        { label: 'આર્ટસ  (Arts)',                              value: 1 },
        { label: 'વિજ્ઞાન (Science)',                       value: 2 },
        { label: 'વાણિજ્ય (Commerce)',                      value: 3 },
        { label: 'એન્જિનિયરિંગ / ટેક્નોલોજી (Engineering)', value: 4 },
        { label: 'તબીબી / પેરામેડિકલ (Medical)',            value: 5 },
        { label: 'કાયદો (Law)',                             value: 6 },
        { label: 'શિક્ષણ (Education / B.Ed)',               value: 7 },
        { label: 'અન્ય (Other)',                            value: 8 },
      ]
    },
    {
      // Rendered dynamically after stream is selected
      id: 'course', type: 'course_select',
      label: 'અભ્યાસક્રમ (Course)', required: true,
    },
    {
      id: 'year_of_study', type: 'radio',
      label: 'અભ્યાસ વર્ષ (Year of Study)', required: true,
      options: [
        { label: 'પહેલું  વર્ષ (1st Year)', value: 1 },
        { label: 'બીજું  વર્ષ (2nd Year)', value: 2 },
        { label: 'ત્રીજું  વર્ષ (3rd Year)', value: 3 },
        { label: 'ચોથું  વર્ષ (4th Year)', value: 4 },
        { label: 'પાંચમું  વર્ષ+ (5th Year+)', value: 5 },
      ]
    }];

  // ── INTERNAL STATE ───────────────────────────────────────────────
  let responses  = {};
  let activeType = 'generic';

  // ── FIELD RESOLVER ───────────────────────────────────────────────
  function getFields(type) {
  if (type === 'college') return COLLEGE_FIELDS;

  if (type === 'education_occupation') {
    return [
      ...GENERIC_FIELDS,
      ...EDUCATION_NON_STUDENT_FIELDS,
      ...OCCUPATION_NON_STUDENT_FIELDS
    ];
  }

  return GENERIC_FIELDS;
}

  // ── RENDER ───────────────────────────────────────────────────────
  function render(containerId, type) {
    activeType = type || 'generic';
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const fields = getFields(activeType);

    fields.forEach(field => {
      if (field.section) {
        const sec = document.createElement('div');
        sec.className = 'sd-section';
        sec.textContent = field.section;
        container.appendChild(sec);
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'sd-field';
      wrapper.id = `sd-wrap-${field.id}`;

      // Label
      const labelEl = document.createElement('div');
      labelEl.className = 'sd-label';
      labelEl.innerHTML = field.label +
        (field.required ? ' <span class="sd-required">*</span>' : '');
      wrapper.appendChild(labelEl);

      if (field.sublabel) {
        const sub = document.createElement('div');
        sub.className = 'sd-sublabel';
        sub.textContent = field.sublabel;
        wrapper.appendChild(sub);
      }

      // ── NUMBER INPUT ──────────────────────────────────────────
      if (field.type === 'number') {
        const input = document.createElement('input');
        input.type        = 'number';
        input.className   = 'sd-input';
        input.min         = field.min || 0;
        input.max         = field.max || 999;
        input.placeholder = `${field.min}–${field.max}`;
        input.value       = responses[field.id] ?? '';
        input.oninput     = () => {
          responses[field.id] = input.value ? Number(input.value) : null;
        };
        wrapper.appendChild(input);
      }

      // ── TEXT INPUT ────────────────────────────────────────────
      if (field.type === 'text') {
        const input = document.createElement('input');
        input.type        = 'text';
        input.className   = 'sd-input sd-input-text';
        input.placeholder = field.placeholder || '';
        input.value       = responses[field.id] ?? '';
        input.oninput     = () => {
          responses[field.id] = input.value.trim() || null;
        };
        wrapper.appendChild(input);
      }

      // ── DROPDOWN ──────────────────────────────────────────────
      if (field.type === 'dropdown') {
        const select = document.createElement('select');
        select.className = 'sd-select';
        const placeholder = document.createElement('option');
        placeholder.value    = '';
        placeholder.textContent = '— જિલ્લો પસંદ કરો / Select district —';
        placeholder.disabled = true;
        placeholder.selected = !responses[field.id];
        select.appendChild(placeholder);

        field.options.forEach(opt => {
          const option = document.createElement('option');
          option.value       = opt;
          option.textContent = opt;
          if (responses[field.id] === opt) option.selected = true;
          select.appendChild(option);
        });

        select.onchange = () => {
          responses[field.id] = select.value || null;
        };
        wrapper.appendChild(select);
      }

      // ── RADIO ─────────────────────────────────────────────────
      if (field.type === 'radio') {
        const optWrap = document.createElement('div');
        optWrap.className = 'sd-options';
        field.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.type      = 'button';
          btn.className = 'sd-opt' +
            (responses[field.id] === opt.value ? ' sd-opt-sel' : '');
          btn.textContent = opt.label;
          btn.onclick = () => {
            responses[field.id] = opt.value;
            optWrap.querySelectorAll('.sd-opt')
              .forEach(b => b.classList.remove('sd-opt-sel'));
            btn.classList.add('sd-opt-sel');

            // If stream changed, re-render course selector
            if (field.id === 'stream') {
              responses['course']       = null;
              responses['course_other'] = null;
              renderCourseField(container);
            }
          };
          optWrap.appendChild(btn);
        });
        wrapper.appendChild(optWrap);
      }

      // ── COURSE SELECT (two-level, rendered dynamically) ───────
      if (field.type === 'course_select') {
        wrapper.id = 'sd-wrap-course';
        // Hide until stream is selected
        if (!responses['stream']) {
          wrapper.style.display = 'none';
        } else {
          buildCourseOptions(wrapper);
        }
      }

      container.appendChild(wrapper);
    });
  }

  // ── COURSE FIELD BUILDER ─────────────────────────────────────────
  function buildCourseOptions(wrapper) {
    const streamVal = responses['stream'];
    const courses   = COURSE_MAP[streamVal] || [];

    // Remove previous options if re-rendering
    const existing = wrapper.querySelector('.sd-options');
    const existingOther = wrapper.querySelector('.sd-other-wrap');
    if (existing)     existing.remove();
    if (existingOther) existingOther.remove();

    const labelEl = wrapper.querySelector('.sd-label');
    if (labelEl) {
      // Re-show wrapper
      wrapper.style.display = '';
    }

    const optWrap = document.createElement('div');
    optWrap.className = 'sd-options';

    courses.forEach(opt => {
      const btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'sd-opt' +
        (responses['course'] === opt.value ? ' sd-opt-sel' : '');
      btn.textContent = opt.label;
      btn.onclick = () => {
        responses['course'] = opt.value;
        optWrap.querySelectorAll('.sd-opt')
          .forEach(b => b.classList.remove('sd-opt-sel'));
        btn.classList.add('sd-opt-sel');

        // Show/hide free text for Other
        const otherWrap = wrapper.querySelector('.sd-other-wrap');
        if (otherWrap) {
          otherWrap.style.display = opt.value === '__other__' ? '' : 'none';
          if (opt.value !== '__other__') responses['course_other'] = null;
        }
      };
      optWrap.appendChild(btn);
    });

    wrapper.appendChild(optWrap);

    // Other free text box (hidden until "Other" selected)
    const otherWrap = document.createElement('div');
    otherWrap.className = 'sd-other-wrap';
    otherWrap.style.display = responses['course'] === '__other__' ? '' : 'none';
    otherWrap.style.marginTop = '0.6rem';

    const otherInput = document.createElement('input');
    otherInput.type        = 'text';
    otherInput.className   = 'sd-input sd-input-text';
    otherInput.placeholder = 'અભ્યાસક્રમ લખો · Type course name';
    otherInput.value       = responses['course_other'] ?? '';
    otherInput.oninput     = () => {
      responses['course_other'] = otherInput.value.trim() || null;
    };
    otherWrap.appendChild(otherInput);
    wrapper.appendChild(otherWrap);
  }

  // Re-renders only the course field after stream changes
  function renderCourseField(container) {
    const courseWrap = container.querySelector('#sd-wrap-course');
    if (courseWrap) buildCourseOptions(courseWrap);
  }

  // ── VALIDATION ───────────────────────────────────────────────────
  function isComplete() {
    const fields = getFields(activeType);
    return fields
      .filter(f => f.required && !f.section)
      .every(f => {
        if (f.type === 'course_select') {
          // Must have a course selected
          if (!responses['course']) return false;
          // If "Other" selected, must have free text
          if (responses['course'] === '__other__') {
            return responses['course_other'] &&
                   responses['course_other'].trim() !== '';
          }
          return true;
        }
        const v = responses[f.id];
        return v !== null && v !== undefined && v !== '';
      });
  }

  // ── GET DATA ─────────────────────────────────────────────────────
  function getData() {
    if (!isComplete()) return null;

    const data = { ...responses };

    // Resolve course display value for storage
    if (activeType === 'college') {
      if (data.course === '__other__') {
        data.course_label = data.course_other || 'Other';
      } else {
        const streamCourses = COURSE_MAP[data.stream] || [];
        const found = streamCourses.find(c => c.value === data.course);
        data.course_label = found ? found.label : data.course;
      }
    }

    return data;
  }

  // ── RESET ────────────────────────────────────────────────────────
  function reset() {
    responses  = {};
    activeType = 'generic';
  }

  return { render, isComplete, getData, reset };

})();