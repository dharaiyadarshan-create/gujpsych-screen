/**
 * GujPsych-Screen (ગુજસાઇક-સ્ક્રીન)
 * sociodem.js — Sociodemographic Form Module
 *
 * ─────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────
 * socioDem.render('container-id', 'college', 'district') // college plus district  form 
 * SocioDem.isComplete() → boolean             // Check if all required fields are filled
 * SocioDem.getData()    → object | null       // Get validated form data
 * SocioDem.reset()                            // Reset form state
 *
 * ─────────────────────────────────────────────
 * FORM FIELD GROUPS
 * ─────────────────────────────────────────────
 *
 * GENERIC_FIELDS
 * → Basic demographic information:
 *    - Age
 *    - Gender
 *    - Marital Status
 *    - Residence
 * 
 * COURSE_MAP
 * → Stream-wise course options (used in dynamic course selection)
 *
 * COLLEGE_FIELDS
 * → College-specific details:
 *    - College Name
 *    - District
 *    - Type of College
 *    - Stream
 *    - Course (dynamic)
 *    - Year of Study
 *
 * GUJARAT_DISTRICTS
 * → List of districts used in dropdown selection
 *
 * ─────────────────────────────────────────────
 * NOTES
 * ─────────────────────────────────────────────
 * - Marital status is included in GENERIC_FIELDS
 *
 */

const SocioDem = (() => {

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
  function getFields() {
  return [
    ...GENERIC_FIELDS,
    ...COLLEGE_FIELDS
    
  ];
}
 // ── RENDER ─────────────────────────────────────
  function render(containerId) {

    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container "${containerId}" not found`);
      return;
    }

    container.innerHTML = '';

    const fields = getFields();

    fields.forEach(field => {

      // SECTION
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

      // LABEL
      const label = document.createElement('div');
      label.className = 'sd-label';
      label.innerHTML =
        field.label +
        (field.required ? ' <span class="sd-required">*</span>' : '');
      wrapper.appendChild(label);

      // SUBLABEL
      if (field.sublabel) {
        const sub = document.createElement('div');
        sub.className = 'sd-sublabel';
        sub.textContent = field.sublabel;
        wrapper.appendChild(sub);
      }

      // NUMBER
      if (field.type === 'number') {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'sd-input';
        input.placeholder = `${field.min}–${field.max}`;
        input.value = responses[field.id] ?? '';

        input.oninput = () => {
          responses[field.id] = input.value ? Number(input.value) : null;
        };

        wrapper.appendChild(input);
      }

      // TEXT
      if (field.type === 'text') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sd-input';
        input.placeholder = field.placeholder || '';
        input.value = responses[field.id] ?? '';

        input.oninput = () => {
          responses[field.id] = input.value.trim() || null;
        };

        wrapper.appendChild(input);
      }

      // DROPDOWN (District)
      if (field.type === 'dropdown') {
        const select = document.createElement('select');
        select.className = 'sd-select';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select district';
        placeholder.disabled = true;
        placeholder.selected = !responses[field.id];
        select.appendChild(placeholder);

        field.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (responses[field.id] === opt) option.selected = true;
          select.appendChild(option);
        });

        select.onchange = () => {
          responses[field.id] = select.value || null;
        };

        wrapper.appendChild(select);
      }

      // RADIO
      if (field.type === 'radio') {
        const wrap = document.createElement('div');
        wrap.className = 'sd-options';

        field.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className =
            'sd-opt' +
            (responses[field.id] === opt.value ? ' sd-opt-sel' : '');

          btn.textContent = opt.label;

          btn.onclick = () => {
            responses[field.id] = opt.value;

            wrap.querySelectorAll('.sd-opt')
              .forEach(b => b.classList.remove('sd-opt-sel'));

            btn.classList.add('sd-opt-sel');

            // 🔥 STREAM → update course
            if (field.id === 'stream') {
              responses.course = null;
              responses.course_other = null;
              renderCourse(container);
            }
          };

          wrap.appendChild(btn);
        });

        wrapper.appendChild(wrap);
      }

      // COURSE (dynamic)
      if (field.type === 'course_select') {
        wrapper.id = 'sd-wrap-course';

        if (!responses.stream) {
          wrapper.style.display = 'none';
        } else {
          buildCourse(wrapper);
        }
      }

      container.appendChild(wrapper);
    });
  }

  // ── COURSE BUILDER ──────────────────────────────
  function buildCourse(wrapper) {
    const courses = COURSE_MAP[responses.stream] || [];

    wrapper.innerHTML = wrapper.innerHTML.split('</div>')[0] + '</div>';

    const wrap = document.createElement('div');
    wrap.className = 'sd-options';

    courses.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'sd-opt' +
        (responses.course === opt.value ? ' sd-opt-sel' : '');

      btn.textContent = opt.label;

      btn.onclick = () => {
        responses.course = opt.value;

        wrap.querySelectorAll('.sd-opt')
          .forEach(b => b.classList.remove('sd-opt-sel'));

        btn.classList.add('sd-opt-sel');

        renderCourse(wrapper);
      };

      wrap.appendChild(btn);
    });

    wrapper.appendChild(wrap);

    // OTHER INPUT
    if (responses.course === '__other__') {
      const input = document.createElement('input');
      input.className = 'sd-input';
      input.placeholder = 'Type course';

      input.value = responses.course_other || '';

      input.oninput = () => {
        responses.course_other = input.value.trim();
      };

      wrapper.appendChild(input);
    }

    wrapper.style.display = '';
  }

  function renderCourse(container) {
    const el = container.querySelector('#sd-wrap-course');
    if (el) buildCourse(el);
  }

  // ── VALIDATION ─────────────────────────────────
  function isComplete() {
    return getFields()
      .filter(f => f.required && !f.section)
      .every(f => {
        if (f.type === 'course_select') {
          if (!responses.course) return false;
          if (responses.course === '__other__') {
            return responses.course_other;
          }
          return true;
        }
        return responses[f.id];
      });
  }

  // ── DATA ───────────────────────────────────────
  function getData() {
    if (!isComplete()) return null;
    return { ...responses };
  }

  function reset() {
    responses = {};
  }

  return { render, isComplete, getData, reset };

})();