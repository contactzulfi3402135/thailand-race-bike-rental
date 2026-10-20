export type Lang = 'en' | 'th' | 'zh';
export type CurrencyCode = 'USD' | 'THB' | 'CNY';

export interface LocalizedText {
  en: string;
  th: string;
  zh: string;
}

export interface LocalizedList {
  en: string[];
  th: string[];
  zh: string[];
}

export interface BikeBuildSpec {
  category: LocalizedText;
  detail: LocalizedText;
}

export interface FleetBike {
  id: string;
  slug: string;
  name: string;
  year: number;
  classTag: 'SUPERSPORT' | 'SUPERSTOCK 1000' | 'FACTORY EXOTIC';
  featuredBadge?: LocalizedText;
  status: 'AVAILABLE' | 'LIMITED';
  priceUsd: number;
  whp: number;
  weightKg: number;
  displacement: string;
  topSpeedKmh: number;
  lapBuriram: string;
  lapBira: string;
  image: string;
  pitImage: string;
  tagline: LocalizedText;
  summary: LocalizedText;
  includedHighlights: LocalizedList;
  riderNotes: LocalizedList;
  buildSheet: BikeBuildSpec[];
}

export interface ThaiCircuit {
  id: string;
  name: LocalizedText;
  location: LocalizedText;
  grade: string;
  lengthKm: string;
  turns: number;
  straightM: number;
  transferFromBkk: LocalizedText;
  image: string;
  secondaryImage: string;
  description: LocalizedText;
  nextDates: string[];
}

export interface SiteConfig {
  brandName: string;
  brandSub: LocalizedText;
  heroEyebrow: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  whatsappNumber: string; // digits format e.g. 66895550199
  messengerHandle: string; // e.g. apex9trackthailand
  instagramHandle: string; // e.g. taxedr9
  lineId: string;
  wechatId: string;
  activeVideoMode: 'track' | 'pov' | 'custom';
  customVideoUrl: string;
  bikes: FleetBike[];
}

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  THB: { symbol: '฿', rate: 33.8, label: 'THB (฿)' },
  CNY: { symbol: '¥', rate: 7.12, label: 'CNY (¥)' },
};

export function formatMoney(usd: number, currency: CurrencyCode): string {
  const { symbol, rate } = CURRENCIES[currency];
  const converted = Math.round(usd * rate);
  return `${symbol}${converted.toLocaleString('en-US')}`;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'APEX9 MOTORSPORT',
  brandSub: {
    en: 'THAILAND RACE BIKE RENTALS & TRACK DAYS',
    th: 'บริการเช่ารถแข่งซูเปอร์ไบค์และแทร็กเดย์ในประเทศไทย',
    zh: '泰国专业赛道摩托车租赁与赛道日全包服务',
  },
  heroEyebrow: {
    en: 'BURIRAM MOTOGP CIRCUIT · BIRA PATTAYA · NAKHON CHAI SI',
    th: 'สนามช้าง บุรีรัมย์ · พีระ พัทยา · ไทยแลนด์เซอร์กิต นครชัยศรี',
    zh: '武里南 MotoGP 国际赛道 · 芭提雅 Bira · 佛统泰国赛道',
  },
  heroTitle: {
    en: 'ARRIVE AT THE PIT BOX. RIDE FULL RACE SPEC.',
    th: 'มาถึงพิตบ็อกซ์ พร้อมบิดลงสนามทันที',
    zh: '抵达维修站，即刻驾驶专业改装赛车',
  },
  heroSubtitle: {
    en: 'Turnkey track-prepared Yamaha R9, R1M, Honda CBR1000RR-R SP & Ducati Panigale V4 S rentals across Thailand. Dedicated race mechanic, enclosed transport, pit box & tire warmers included.',
    th: 'บริการเช่ารถแข่งซูเปอร์ไบค์แต่งเต็มสเปกสนาม ทั้ง Yamaha R9, R1M, CBR1000RR-R SP และ Panigale V4 S พร้อมทีมช่างเรซซิ่งส่วนตัว ขนส่งรถถึงสนาม พิตบ็อกซ์ และผ้าวอร์มยางครบจบในที่เดียว',
    zh: '全泰顶级赛道改装超跑租赁：Yamaha R9、R1M、CBR1000RR-R SP 与 Panigale V4 S。每日租金已含专属赛事技师、封闭式拖车运输、空调维修站位及轮胎加温器。',
  },
  whatsappNumber: '66819940909',
  messengerHandle: 'ButlerGarage',
  instagramHandle: 'taxedr9',
  lineId: '@apex9track',
  wechatId: 'APEX9_Thailand',
  activeVideoMode: 'track',
  customVideoUrl: '',
  bikes: [
    {
      id: 'yamaha-yzf-r9',
      slug: 'yamaha-yzf-r9',
      name: 'Yamaha YZF-R9 Race Spec',
      year: 2026,
      classTag: 'SUPERSPORT',
      featuredBadge: {
        en: 'SIGNATURE FLEET MACHINE',
        th: 'รุ่นไฮไลต์ยอดนิยมประจำทีม',
        zh: '车队招牌旗舰中量级赛车',
      },
      status: 'AVAILABLE',
      priceUsd: 790,
      whp: 129,
      weightKg: 179,
      displacement: '890cc CP3 Triple',
      topSpeedKmh: 274,
      lapBuriram: '1:44.8',
      lapBira: '1:05.9',
      image: '/images/bike-yamaha-r9.jpg',
      pitImage: '/images/pit-mechanic-team.jpg',
      tagline: {
        en: 'Razor-sharp CP3 torque, Moto2-inspired chassis balance & full Öhlins track setup.',
        th: 'แรงบิดเครื่องยนต์ 3 สูบ CP3 จับคู่ช่วงล่าง Öhlins เซ็ตอัพสนามเต็มระบบ เลี้ยวมั่นใจทุกโค้ง',
        zh: '强劲 CP3 三缸扭矩输出，搭配全套 Öhlins 赛道级悬挂调校，弯道指向极致精准。',
      },
      summary: {
        en: 'Our signature 2026 YZF-R9 build combines linear 3-cylinder exit drive with ultra-light carbon race fairings, unrestricted woolich ECU race map, auto-blipper quickshifter, and Brembo Stylema braking precision—ideal for fast lap progression at both Bira and Chang International Circuit.',
        th: 'รถแข่ง YZF-R9 ปี 2026 สเปกพิเศษของทีม มาพร้อมแฟริ่งคาร์บอนไฟเบอร์น้ำหนักเบา รีแมพกล่อง ECU ปลดล็อกเต็มกำลัง ท่อฟูลซิสเต็มไทเทเนียม SC-Project CR-T ควิกชิฟเตอร์ขึ้น-ลงออโต้บลิปเปอร์ และเบรก Brembo Stylema ขี่สนุก คุมง่าย ทำเวลาต่อรอบได้เร็วตั้งแต่วันแรก',
        zh: '车队主打 2026 款 YZF-R9 专业赛道改装版，配备轻量化碳纤维赛用包围、全段 SC-Project 钛合金排气、ECU 全马力特调程序、双向快排及 Brembo Stylema 卡钳，兼顾极高弯速与友好操控。',
      },
      includedHighlights: {
        en: [
          'Dedicated race mechanic all day (suspension sag, gearing & pressure tuning)',
          'Enclosed van transport to & from circuit pit lane',
          'Air-conditioned pit box bay, paddock stands & digital tire warmers',
          'Track-used Pirelli Diablo Superbike SC1/SC2 slicks (fresh set optional)',
          'Ice water, electrolytes, paddock chairs & session timing support',
        ],
        th: [
          'ช่างเรซซิ่งดูแลประจำรถตลอดทั้งวัน (เซ็ตช่วงล่าง ลมยาง และอัตราทดสเตอร์)',
          'บริการรถตู้ทึบขนส่งรถแข่งไป-กลับถึงพิตเลนสนาม',
          'ห้องพิตบ็อกซ์ติดแอร์ สแตนด์ยกรถหน้า-หลัง และผ้าวอร์มยางดิจิทัล',
          'ยางสลิค Pirelli Diablo Superbike SC1/SC2 สภาพพร้อมซ้อม (สั่งเบิกยางใหม่เพิ่มได้)',
          'เครื่องดื่มเกลือแร่ น้ำแข็ง เก้าอี้พักนักแข่ง และบริการจับเวลาต่อรอบ',
        ],
        zh: [
          '全天专属赛事技师驻场服务（根据体重调校悬挂预载、阻尼与胎压）',
          '往返曼谷与赛道的封闭式专业赛车运输车服务',
          '空调维修站车位（Pit Box）、前后起车架及数码恒温暖胎器',
          '状态良好的倍耐力 Diablo Superbike 热熔光头胎（可升级全新轮胎套组）',
          '维修站冰镇饮用水、电解质饮料、休息区及单圈计时协助',
        ],
      },
      riderNotes: {
        en: [
          'Fuel & circuit entry ticket billed transparently at track cost (or bundled on request)',
          'Optional brand-new Pirelli Slick tire set installed & balanced: $420 / set',
          'Refundable damage excess cap clearly agreed in writing prior to pit exit',
        ],
        th: [
          'น้ำมันเบนซินออกเทนสูงและค่าสมัครสนามคิดตามจริงหน้างาน (หรือเลือกแพ็กเกจรวมครบได้)',
          'สามารถสั่งเปลี่ยนยางสลิค Pirelli คู่ใหม่แกะกล่องพร้อมถ่วงล้อ: $420 / ชุด',
          'วงเงินประกันความเสียหายระบุชัดเจนโปร่งใสในสัญญาก่อนลงสนาม',
        ],
        zh: [
          '高标号赛用燃油及赛道门票按实际成本透明结算（亦可选择全包套餐）',
          '可选装全新倍耐力光头胎含动平衡安装：$420 / 套',
          '摔车免赔额上限在出站前书面明确约定，绝无隐形收费',
        ],
      },
      buildSheet: [
        {
          category: { en: 'Engine & Exhaust', th: 'เครื่องยนต์และท่อไอเสีย', zh: '引擎与排气系统' },
          detail: {
            en: '890cc CP3 Race ECU Map (129 WHP), SC-Project CR-T Titanium Full System, Sprint P08 Filter',
            th: 'เครื่องยนต์ CP3 890cc รีแมพสนาม 129 WHP, ท่อไทเทเนียม SC-Project CR-T ฟูลซิสเต็ม, กรองอากาศ Sprint P08',
            zh: '890cc CP3 特调赛事 ECU（轮上 129 匹），SC-Project CR-T 全段钛合金排气，Sprint 高流量空滤',
          },
        },
        {
          category: { en: 'Suspension', th: 'ระบบกันสะเทือน', zh: '悬挂系统' },
          detail: {
            en: 'Öhlins NIX30 Front Cartridges + Öhlins TTX GP Rear Shock + Öhlins SD091 Steering Damper',
            th: 'โช้คหน้าไส้ใน Öhlins NIX30 + โช้คหลัง Öhlins TTX GP + กันสะบัด Öhlins SD091 ปรับละเอียด',
            zh: 'Öhlins NIX30 前叉内胆套件 + Öhlins TTX GP 后减震 + Öhlins 赛用钛尺方向阻尼器',
          },
        },
        {
          category: { en: 'Braking System', th: 'ระบบเบรกเรซซิ่ง', zh: '制动系统' },
          detail: {
            en: 'Brembo Stylema Monobloc Calipers, Brembo 19RCS Corsa Corta Master Cylinder, Z04 Race Pads, Braided Lines',
            th: 'ปั๊มล่าง Brembo Stylema, ปั๊มบน Brembo 19RCS Corsa Corta, ผ้าเบรกเรซซิ่ง Z04, สายถักทั้งระบบ',
            zh: 'Brembo Stylema 一体式辐射卡钳，19RCS Corsa Corta 直推上泵，Z04 赛用刹车片，钢喉油管',
          },
        },
        {
          category: { en: 'Electronics & Data', th: 'อิเล็กทรอนิกส์และดาต้า', zh: '电控与数据采集' },
          detail: {
            en: '6-Axis IMU Lean-Sensitive TC, Slide Control, Up/Down Auto-Blipper, AiM Solo 2 DL GPS Lap Timer',
            th: 'IMU 6 แกน แทร็กชันคอนโทรลตามองศาเอียง, ควิกชิฟเตอร์ขึ้น-ลงออโต้บลิป, ตัวจับเวลา GPS AiM Solo 2 DL',
            zh: '6 轴 IMU 倾角循迹防滑、侧滑控制、双向电子快排、AiM Solo 2 DL 卫星单圈计时仪',
          },
        },
      ],
    },
    {
      id: 'yamaha-yzf-r1m',
      slug: 'yamaha-yzf-r1m',
      name: 'Yamaha YZF-R1M Superstock',
      year: 2025,
      classTag: 'SUPERSTOCK 1000',
      featuredBadge: {
        en: 'PRO BENCHMARK LITERBIKE',
        th: 'ตัวแรงพิกัด 1000cc ยอดนิยม',
        zh: '公升级赛道标杆战车',
      },
      status: 'AVAILABLE',
      priceUsd: 990,
      whp: 202,
      weightKg: 186,
      displacement: '998cc Crossplane CP4',
      topSpeedKmh: 299,
      lapBuriram: '1:40.2',
      lapBira: '1:03.8',
      image: '/images/bike-yamaha-r1m.jpg',
      pitImage: '/images/hero-pov-fallback.jpg',
      tagline: {
        en: 'Crossplane CP4 202 WHP race build with YEC electronics, carbon bodywork & Öhlins TTX.',
        th: 'ขุมพลัง Crossplane 4 สูบ 202 แรงม้าที่ล้อ แฟริ่งคาร์บอนแท้ทั้งคัน ช่วงล่าง Öhlins เรซซิ่งเต็มระบบ',
        zh: '十字曲轴四缸轮上 202 匹马力，全碳纤维赛用整流罩与 YEC 竞赛电控套件。',
      },
      summary: {
        en: 'Prepared to Superstock 1000 regulations with YEC kit harness, H2O oversize race radiator for 35°C Thai track heat, Akrapovič Evolution titanium system, and GP shift rearsets. Delivers rock-solid stability down Chang International Circuit’s 1 km straight.',
        th: 'เซ็ตอัพตามกติกา Superstock 1000 พร้อมชุดสายไฟ YEC หม้อน้ำสนามขนาดใหญ่พิเศษ H2O รองรับอากาศเมืองไทย ท่อฟูลไทเทเนียม Akrapovič และเกียร์โยงเรซซิ่ง เสถียรสุดขีดบนทางตรง 1 กิโลเมตรของสนามช้างฯ',
        zh: '严格按照 Superstock 1000 赛事规格打造，搭载 H2O 加大竞技水箱（专为泰国高温赛道优化）、天蝎全段钛合金排气及反档竞技脚踏，在武里南 1 公里大直道稳如泰山。',
      },
      includedHighlights: {
        en: [
          'Full-day dedicated race technician & suspension geometry setup',
          'Round-trip enclosed circuit transport & pit box garage station',
          'Tire warmers, front/rear stands, spare wheel rims ready in pit',
          'Pirelli Diablo Superbike slicks pre-heated to 80°C before every session',
          'AiM GPS lap timer data download after each 20-minute session',
        ],
        th: [
          'ช่างเทคนิคเรซซิ่งดูแลเฉพาะคันตลอดวัน ปรับเซ็ตช่วงล่างตามน้ำหนักตัว',
          'ขนส่งรถไป-กลับสนามด้วยรถตู้ทึบ พร้อมพิตบ็อกซ์ส่วนตัว',
          'ผ้าวอร์มยางอุณหภูมิ 80°C ก่อนลงซ้อมทุกรอบ พร้อมล้ออะไหล่สำรองในพิต',
          'ยางสลิค Pirelli Diablo Superbike เช็กลมยางร้อนทุกเซสชัน',
          'ดึงข้อมูลเวลาต่อรอบผ่าน AiM GPS หลังจบทุกเซสชัน',
        ],
        zh: [
          '专属赛事技师全天跟车调校悬挂几何与电子系统',
          '封闭式专车往返运输与赛道空调维修站车位',
          '每节出站前轮胎恒温加热至 80°C，维修站备有备用轮毂',
          '倍耐力热熔光头胎实时热胎压监测调整',
          '每节 20 分钟练习后提供 AiM GPS 轨迹数据分析',
        ],
      },
      riderNotes: {
        en: [
          'Recommended for experienced track riders familiar with 1000cc power delivery',
          'Fresh Pirelli slick set available in pit box ($420 installed)',
          'Fuel & circuit entry settled at cost or pre-bundled on booking',
        ],
        th: [
          'แนะนำสำหรับผู้ขับขี่ที่มีประสบการณ์ขี่รถบิ๊กไบค์ในสนามมาก่อน',
          'มีบริการยางสลิค Pirelli คู่ใหม่แกะกล่องพร้อมเปลี่ยนที่สนาม ($420)',
          'ค่าน้ำมันและค่าลงสนามชำระตามจริง หรือรวมในแพ็กเกจล่วงหน้าได้',
        ],
        zh: [
          '建议具备赛道驾驶经验或公升级跑车控车经验的骑士预订',
          '维修站现场备有全新倍耐力光头胎可供更换（$420 含安装）',
          '燃油与赛道日门票按实结算或预订时一键打包',
        ],
      },
      buildSheet: [
        {
          category: { en: 'Engine & Cooling', th: 'เครื่องยนต์และระบบหล่อเย็น', zh: '引擎与散热系统' },
          detail: {
            en: '998cc CP4 Superstock Spec (202 WHP), H2O Oversize Race Radiator, Akrapovič Full Titanium System',
            th: 'CP4 998cc 202 แรงม้าที่ล้อ, หม้อน้ำเรซซิ่ง H2O, ท่อไทเทเนียมฟูลซิสเต็ม Akrapovič',
            zh: '998cc CP4 轮上 202 匹，H2O 大容量赛用散热水箱，天蝎全段钛合金排气',
          },
        },
        {
          category: { en: 'Chassis & Suspension', th: 'โครงสร้างและช่วงล่าง', zh: '底盘与悬挂' },
          detail: {
            en: 'Öhlins FGRT 219 Front Forks + Öhlins TTX GP Shock, Attack Performance Triple Clamps',
            th: 'โช้คหน้า Öhlins FGRT 219 + โช้คหลัง TTX GP, แผงคอเรซซิ่ง Attack Performance',
            zh: 'Öhlins FGRT 219 前减震 + TTX GP 后减震，Attack Performance 赛用三星联板',
          },
        },
        {
          category: { en: 'Brakes & Controls', th: 'ระบบเบรกและชุดควบคุม', zh: '制动与操控组件' },
          detail: {
            en: 'Brembo GP4-RX Billet Calipers, Brembo T-Drive 320mm Rotors, Galespeed Thumb Rear Brake',
            th: 'คาลิปเปอร์ Brembo GP4-RX CNC, จานดิสก์ T-Drive 320 มม., เบรกหลังนิ้วโป้ง Galespeed',
            zh: 'Brembo GP4-RX 锻造卡钳，320mm T-Drive 浮动盘，Galespeed 拇指后刹套件',
          },
        },
        {
          category: { en: 'Electronics', th: 'ระบบอิเล็กทรอนิกส์ YEC', zh: 'YEC 竞赛电控' },
          detail: {
            en: 'YEC Race Kit Wiring Loom & ECU, Pit Limiter, 10-Level Wet/Dry Traction & Engine Brake Maps',
            th: 'ชุดสายไฟและกล่อง YEC แท้, Pit Lane Limiter, โหมดปรับ TC และ Engine Brake 10 ระดับ',
            zh: 'YEC 赛用线束与电脑、维修区限速键、10 段循迹防滑与引擎制动独立可调',
          },
        },
      ],
    },
    {
      id: 'honda-cbr1000rr-r',
      slug: 'honda-cbr1000rr-r',
      name: 'Honda CBR1000RR-R Fireblade SP',
      year: 2025,
      classTag: 'FACTORY EXOTIC',
      featuredBadge: {
        en: 'HRC SUPERBIKE SPEC · 215 WHP',
        th: 'สเปกสนาม HRC แท้ · 215 แรงม้า',
        zh: 'HRC 厂队赛化规格 · 215 匹',
      },
      status: 'AVAILABLE',
      priceUsd: 1390,
      whp: 215,
      weightKg: 185,
      displacement: '999cc Inline-4 HRC Spec',
      topSpeedKmh: 306,
      lapBuriram: '1:39.1',
      lapBira: '1:03.4',
      image: '/images/bike-cbr1000rrr.jpg',
      pitImage: '/images/pit-mechanic-team.jpg',
      tagline: {
        en: 'Full HRC race wiring loom, ASBK-spec top end, H2O radiator & Akrapovič Evolution titanium.',
        th: 'จัดเต็มชุดสายไฟและกล่อง HRC เรซซิ่งแท้ เครื่องยนต์สเปกแข่ง 215 WHP พร้อมล้อสำรองในพิต',
        zh: '搭载原厂 HRC 竞赛线束与 ECU，轮上爆发 215 匹马力，直道极速统治级表现。',
      },
      summary: {
        en: 'Built with no expense spared: HRC race kit electronics, over 215 WHP at the rear tire, twin aerodynamic MotoGP winglets, Brembo GP braking hardware, H2O race radiator, and spare quick-change rims standing by in your pit box.',
        th: 'สุดยอดรถแข่งสายพันธุ์ HRC ที่สร้างแบบไร้ขีดจำกัด กำลังทะลุ 215 แรงม้าที่ล้อ วิงเล็ทสร้างแรงกดระดับ MotoGP หม้อน้ำสนาม H2O เบรก Brembo GP และชุดล้อสำรองพร้อมสลับยางทันทีในพิตบ็อกซ์',
        zh: '不计成本打造的旗舰 HRC 战车：轮上超过 215 匹马力，MotoGP 级空气动力学定风翼、H2O 大水箱、Brembo GP 卡钳及快拆备用轮组随时待命。',
      },
      includedHighlights: {
        en: [
          'Senior chief race mechanic dedicated exclusively to your bike',
          'Enclosed race transporter delivery + VIP air-conditioned pit box',
          'Spare quick-change rims, digital tire warmers & full HRC laptop diagnostics',
          'Suspension sag, fork oil height & gearing tailored to each circuit',
          'Session-by-session HRC telemetry review & cold pit refreshments',
        ],
        th: [
          'หัวหน้าช่างเรซซิ่งดูแลเฉพาะรถของคุณแบบตัวต่อตัวตลอดวัน',
          'รถขนส่งตู้ทึบถึงสนาม พร้อมห้องพิตบ็อกซ์แอร์ VIP และชุดล้อสำรอง',
          'คอมพิวเตอร์จูนกล่อง HRC ปรับกราฟคันเร่งและเอนจิ้นเบรกตามสไตล์ผู้ขี่',
          'เซ็ตอัตราทดสเตอร์และช่วงล่าง Öhlins เฉพาะสนามช้างฯ หรือพีระฯ',
          'วิเคราะห์กราฟดาต้าหลังจบซ้อมทุกเซสชัน พร้อมเครื่องดื่มเย็นตลอดวัน',
        ],
        zh: [
          '首席赛事技师一对一专属保障服务',
          '封闭式专车运输 + VIP 空调维修站独立工位与备用轮组',
          'HRC 官方电脑现场针对骑士习惯微调油门响应与引擎制动',
          '针对武里南或芭提雅赛道齿比与 Öhlins 电控悬挂精准设定',
          '每节练习后数据复盘指导及全天冷饮补给',
        ],
      },
      riderNotes: {
        en: [
          'Spare wheels ready for instant wet/slick swap if tropical rain passes',
          'Brand-new Pirelli slicks optional ($420/set) — zero markup over paddock price',
          'Fuel & track fee billed cleanly at cost or included in VIP package',
        ],
        th: [
          'มีชุดล้อยางฝนสำรองพร้อมสลับทันทีหากมีฝนตกช่วงบ่าย',
          'สั่งเบิกยางสลิค Pirelli ใหม่แกะกล่องในราคาพิต ($420/ชุด ไม่มีบวกเพิ่ม)',
          'ค่าน้ำมันและค่าสนามคิดตามจริง หรือเลือกแพ็กเกจรวมครบจบได้',
        ],
        zh: [
          '现场备有雨胎轮组，遇热带阵雨可快速切换不耽误练习时间',
          '可平价选配全新倍耐力光头胎（$420/套，零溢价）',
          '燃油费与赛道日报名费透明实报实销或一键全包',
        ],
      },
      buildSheet: [
        {
          category: { en: 'HRC Power Unit', th: 'ขุมพลัง HRC เรซซิ่ง', zh: 'HRC 竞赛动力总成' },
          detail: {
            en: '999cc Race Engine (215+ WHP), Akrapovič Evolution Full Titanium System, H2O Race Radiator',
            th: 'เครื่องยนต์ 999cc สเปกแข่ง 215+ WHP, ท่อไทเทเนียม Akrapovič Evolution, หม้อน้ำ H2O',
            zh: '999cc 赛化引擎（轮上 215+ 匹），天蝎 Evolution 钛合金全段排气，H2O 赛用水箱',
          },
        },
        {
          category: { en: 'Suspension', th: 'ช่วงล่าง Öhlins Smart EC', zh: 'Öhlins 赛用悬挂' },
          detail: {
            en: 'Öhlins NPX S-EC 3.0 Pressurized Forks + TTX36 Rear Shock with Manual Race Valve Kit',
            th: 'โช้คหน้าแรงดันแก๊ส Öhlins NPX + โช้คหลัง TTX36 เซ็ตวาล์วเรซซิ่งเต็มระบบ',
            zh: 'Öhlins NPX 加压前叉 + TTX36 后减震（竞赛级阀门改装）',
          },
        },
        {
          category: { en: 'Braking', th: 'เบรก Brembo GP', zh: 'Brembo 顶级制动' },
          detail: {
            en: 'Brembo Stylema R / GP4-RX Calipers, 330mm Floating Race Discs, Staubli Quick-Disconnect Lines',
            th: 'คาลิปเปอร์ Brembo Stylema R, จานดิสก์เรซซิ่ง 330 มม., ข้อต่อสายถักปลดเร็ว Staubli',
            zh: 'Brembo Stylema R 卡钳，330mm 浮动碟盘，Staubli 赛用快拆钢喉接口',
          },
        },
        {
          category: { en: 'Electronics', th: 'กล่องไฟและสายไฟ HRC', zh: 'HRC 原厂竞赛电控' },
          detail: {
            en: 'Full HRC Race Wiring Harness & ECU, Launch Control, Wheelie Control, 2D Data Telemetry',
            th: 'ชุดสายไฟและกล่อง HRC แท้เต็มระบบ, Launch Control, 2D Telemetry บันทึกข้อมูลครบทุกจุดเบรก',
            zh: '全套 HRC 竞赛线束与电脑、弹射起步、防翘头控制及全通道遥测记录',
          },
        },
      ],
    },
    {
      id: 'ducati-panigale-v4s',
      slug: 'ducati-panigale-v4s',
      name: 'Ducati Panigale V4 S Corse',
      year: 2025,
      classTag: 'FACTORY EXOTIC',
      featuredBadge: {
        en: 'ITALIAN V4 FLAGSHIP',
        th: 'ที่สุดแห่งซูเปอร์ไบค์ V4 อิตาลี',
        zh: '意大利 V4 殿堂级超跑',
      },
      status: 'LIMITED',
      priceUsd: 1490,
      whp: 218,
      weightKg: 184,
      displacement: '1,103cc Desmosedici Stradale V4',
      topSpeedKmh: 309,
      lapBuriram: '1:38.9',
      lapBira: '1:03.5',
      image: '/images/bike-panigale-v4s.jpg',
      pitImage: '/images/hero-pov-fallback.jpg',
      tagline: {
        en: 'Counter-rotating MotoGP crankshaft, carbon Corse fairings & Ducati Data Analyzer+ GPS.',
        th: 'ข้อเหวี่ยงหมุนย้อนทิศทางระดับ MotoGP แฟริ่งคาร์บอน Corse พร้อมระบบวิเคราะห์ดาต้า DDA+ GPS',
        zh: 'MotoGP 同源反向旋转曲轴，Corse 碳纤维涂装与原厂 DDA+ 卫星轨迹分析系统。',
      },
      summary: {
        en: 'Experience pure Bologna factory performance on Thailand’s fastest GP tarmac. Equipped with Ducati Corse carbon fiber track bodywork, dry clutch kit, Öhlins Smart EC 3.0 suspension, and full race telemetry.',
        th: 'สัมผัสความเร้าใจระดับโรงงานโบโลญญาบนแทร็กมาตรฐาน MotoGP เมืองไทย มาพร้อมแฟริ่งคาร์บอน Ducati Corse คลัตช์แห้ง ช่วงล่าง Öhlins Smart EC 3.0 และระบบเก็บข้อมูลสนามครบชุด',
        zh: '在泰国 MotoGP 级赛道体验博洛尼亚厂队级 V4 猛兽，配备干式离合套件、碳纤维赛用包围与 Öhlins 第三代电控悬挂。',
      },
      includedHighlights: {
        en: [
          'Ducati-certified race mechanic & full pit box support team',
          'Door-to-pit enclosed race van transport + paddock hospitality',
          'Ducati Data Analyzer+ GPS lap & sector comparison after every session',
          'Pre-warmed Pirelli Diablo Superbike SC1 front / SC0 rear slicks',
          'Full ergonomic footpeg, lever & suspension sag calibration on arrival',
        ],
        th: [
          'ช่างผู้เชี่ยวชาญเฉพาะทาง Ducati ดูแลตลอดวันในห้องพิตบ็อกซ์แอร์',
          'บริการขนส่งรถตู้ทึบถึงพิตเลน พร้อมจุดพักรับรองนักแข่ง',
          'วิเคราะห์เวลาแต่ละเซกเตอร์ผ่าน Ducati Data Analyzer+ GPS ทุกเซสชัน',
          'อุ่นยางสลิค Pirelli SC1/SC0 พร้อมใช้งานก่อนปล่อยตัวทุกรอบ',
          'ปรับตำแหน่งพักเท้า ก้านเบรก-คลัตช์ และระยะยุบโช้คให้เข้ากับสรีระผู้ขี่',
        ],
        zh: [
          '杜卡迪专精赛事技师全天驻场调校与保障',
          '封闭专车直达赛道维修站 + VIP 休息区服务',
          '每节后导出 Ducati Data Analyzer+ 分段弯速与刹车点对比图',
          '倍耐力 SC1/SC0 光头胎恒温预热出站即享巅峰抓地力',
          '现场根据骑士身高体重定制脚踏、手柄角度与悬挂预载',
        ],
      },
      riderNotes: {
        en: [
          'Limited to 1 rider booking per track weekend — early reservation advised',
          'Optional fresh slick set ($420) & 4K Insta360/GoPro Dual-Cam Video ($65)',
          'Fuel & circuit entry fee billed transparently at track rate',
        ],
        th: [
          'รับจองเพียง 1 ท่านต่อสุดสัปดาห์ แนะนำให้สำรองคิวล่วงหน้า',
          'เพิ่มออปชันยางสลิคใหม่ ($420) และกล้อง 4K หน้า-หลังพร้อมกราฟความเร็ว ($65)',
          'ค่าน้ำมันและค่าสนามคิดตามจริงหน้างานอย่างโปร่งใส',
        ],
        zh: [
          '每个赛道日周末仅限 1 位骑士尊享预订，建议提前锁定期限',
          '可选全新光头胎（$420）及前后双机位 4K 遥测视频拍摄（$65）',
          '燃油与赛道报名费按实际成本透明结算',
        ],
      },
      buildSheet: [
        {
          category: { en: 'V4 Race Engine', th: 'เครื่องยนต์ V4 เรซซิ่ง', zh: 'V4 竞赛引擎' },
          detail: {
            en: '1,103cc Desmosedici Stradale (218 WHP), STM EVO-SBK Dry Clutch, Titanium Race Exhaust',
            th: 'Desmosedici Stradale 1,103cc 218 WHP, คลัตช์แห้ง STM EVO-SBK, ท่อเรซซิ่งไทเทเนียม',
            zh: '1,103cc V4 引擎（轮上 218 匹），STM EVO-SBK 竞技干式离合器，钛合金赛排',
          },
        },
        {
          category: { en: 'Suspension & Wheels', th: 'ช่วงล่างและล้อฟอร์จ', zh: '悬挂与锻造轮毂' },
          detail: {
            en: 'Öhlins NPX 25/30 + TTX36 Smart EC 3.0, Marchesini Forged Aluminum Race Wheels',
            th: 'โช้คหน้า-หลังไฟฟ้า Öhlins Smart EC 3.0, ล้อฟอร์จอะลูมิเนียมน้ำหนักเบา Marchesini',
            zh: 'Öhlins Smart EC 3.0 智能赛用悬挂，Marchesini 轻量化锻造轮毂',
          },
        },
        {
          category: { en: 'Braking', th: 'เบรก Brembo Stylema R', zh: 'Brembo 制动系统' },
          detail: {
            en: 'Brembo Stylema R Monobloc Calipers, MCS Radial Master Cylinder, Carbon Cooling Ducts',
            th: 'ปั๊มล่าง Brembo Stylema R พร้อมท่อดักลมคาร์บอนระบายความร้อนเบรก',
            zh: 'Brembo Stylema R 卡钳 + 碳纤维刹车导风散热罩',
          },
        },
        {
          category: { en: 'Electronics', th: 'ระบบควบคุม Ducati Corse', zh: 'Ducati Corse 电控' },
          detail: {
            en: 'Race eCBS, Ducati Traction EVO 3, Slide Control, Ducati Data Analyzer+ GPS',
            th: 'ระบบ DTC EVO 3, Slide Control, Engine Brake EVO 2 พร้อม DDA+ GPS Telemetry',
            zh: 'DTC EVO 3 循迹、侧滑控制、引擎制动管理及原厂 GPS 数据记录仪',
          },
        },
      ],
    },
    {
      id: 'bmw-m1000rr',
      slug: 'bmw-m1000rr',
      name: 'BMW M 1000 RR Competition',
      year: 2025,
      classTag: 'FACTORY EXOTIC',
      status: 'AVAILABLE',
      priceUsd: 1450,
      whp: 212,
      weightKg: 183,
      displacement: '999cc ShiftCam M Titanium',
      topSpeedKmh: 308,
      lapBuriram: '1:39.4',
      lapBira: '1:03.7',
      image: '/images/bike-bmw-m1000rr.jpg',
      pitImage: '/images/pit-mechanic-team.jpg',
      tagline: {
        en: 'Full M Competition carbon package, M carbon wheels & 22.6 kg aerodynamic downforce winglets.',
        th: 'ชุดพาร์ทคาร์บอน M Competition แท้ทั้งคัน ล้อคาร์บอน M และวิงเล็ทสร้างแรงกดหน้า 22.6 กก.',
        zh: '全套 M Competition 碳纤维空气动力学套件与 M 碳纤维轮毂，极致轻量化翻身体验。',
      },
      summary: {
        en: 'BMW Motorrad’s homologation superbike featuring Pankl titanium connecting rods, featherweight M Carbon wheels for lightning-fast chicane flickability, M GPS Laptrigger, and Race Pro modes.',
        th: 'ซูเปอร์ไบค์สายเลือด WSBK ก้านสูบไทเทเนียม Pankl ล้อคาร์บอนไฟเบอร์ M พลิกโค้งไวเหนือชั้น พร้อมระบบ Race Pro ปรับละเอียดและ M GPS Laptrigger แสดงเวลาขึ้นหน้าจอเรือนไมล์ทันที',
        zh: 'WSBK 同源认证战车，搭载钛合金连杆、超轻 M 碳纤维轮毂实现闪电般连续变线速度，配备 M GPS 自动单圈计时显示。',
      },
      includedHighlights: {
        en: [
          'Dedicated race mechanic + enclosed circuit transport + pit box',
          'M Carbon wheels shod with pre-warmed Pirelli Superbike slicks',
          'Custom Race Pro 1/2/3 throttle, wheelie & engine-brake calibration',
          'Full pit hospitality, hydration bar & tire warmer management',
          'On-screen M GPS Laptrigger automatic sector timing at all Thai tracks',
        ],
        th: [
          'ช่างเรซซิ่งประจำรถ + ขนส่งรถตู้ทึบ + ห้องพิตบ็อกซ์แอร์ครบวงจร',
          'ล้อคาร์บอน M รัดด้วยยางสลิค Pirelli อุ่นร้อนพร้อมซ้อมทุกรอบ',
          'ปรับตั้งค่า Race Pro คันเร่งและเอนจิ้นเบรกเฉพาะตัวผู้ขี่',
          'ดูแลน้ำดื่ม เกลือแร่ และเช็กลมยาง-ช่วงล่างหลังจบทุกเซสชัน',
          'ระบบ M GPS Laptrigger จับเวลาขึ้นจอ TFT อัตโนมัติทุกสนามในไทย',
        ],
        zh: [
          '专属赛事技师 + 封闭拖车运输 + 空调维修站全套服务',
          'M 碳纤维轮毂搭配预热倍耐力光头胎',
          '根据骑士驾驶风格定制 Race Pro 动力与防翘头介入等级',
          '维修站全天冷饮补给与每节胎压悬挂精细检查',
          'M GPS 自动识别泰国各大赛道终点线并在仪表实时显示圈速',
        ],
      },
      riderNotes: {
        en: [
          'Reverse GP shift pattern or standard road shift configurable in 5 minutes',
          'Fresh Pirelli slicks available on request ($420/set)',
          'Fuel & track fee transparent at cost or bundled upfront',
        ],
        th: [
          'เลือกสลับเกียร์โยงเป็น GP Shift (กดขึ้น) หรือเกียร์ปกติได้ภายใน 5 นาที',
          'สั่งเบิกยางสลิค Pirelli ชุดใหม่ได้ทันที ($420/ชุด)',
          'ค่าน้ำมันและค่าสนามชำระตามจริงหรือรวมแพ็กเกจล่วงหน้าได้',
        ],
        zh: [
          '5 分钟内可根据习惯切换正档或反档（GP Shift）换挡模式',
          '可随时选装全新倍耐力光头胎（$420/套）',
          '燃油及门票透明实报实销或预订时打包',
        ],
      },
      buildSheet: [
        {
          category: { en: 'M Homologation Engine', th: 'เครื่องยนต์รหัส M', zh: 'M 认证竞赛引擎' },
          detail: {
            en: '999cc ShiftCam 15,100 RPM Ceiling (212 WHP), Full Akrapovič Titanium Exhaust',
            th: '999cc ShiftCam รอบสูงสุด 15,100 RPM (212 WHP), ท่อไทเทเนียมฟูลซิสเต็ม Akrapovič',
            zh: '999cc ShiftCam 最高转速 15,100 转（轮上 212 匹），天蝎全段钛合金排气',
          },
        },
        {
          category: { en: 'Aero & Wheels', th: 'แอโรไดนามิกและล้อคาร์บอน', zh: '空力套件与碳轮' },
          detail: {
            en: 'M Carbon Fairings & Winglets (22.6 kg @ 300 km/h), M Carbon Fiber Wheels',
            th: 'แฟริ่งและวิงเล็ทคาร์บอน M แท้ สร้างแรงกด 22.6 กก., ล้อคาร์บอนไฟเบอร์ M',
            zh: 'M 碳纤维赛用包围与定风翼（产生 22.6kg 下压力），原厂 M 碳纤维轮毂',
          },
        },
        {
          category: { en: 'Braking & Chassis', th: 'เบรก M และชุดช่วงล่าง', zh: 'M 制动与底盘' },
          detail: {
            en: 'Anodized Blue M Billet Calipers, M Swingarm Pivot Kit, M Billet Rearsets',
            th: 'คาลิปเปอร์ M สีน้ำเงินอโนไดซ์, ชุดปรับจุดหมุนสวิงอาร์ม M, เกียร์โยง M CNC',
            zh: '蓝色阳极氧化 M 赛用卡钳、可调后摇臂枢轴套件、M CNC 竞技脚踏',
          },
        },
        {
          category: { en: 'Telemetry', th: 'ระบบเก็บข้อมูล M GPS', zh: 'M 遥测系统' },
          detail: {
            en: 'M GPS Laptrigger + 2D Data Logger (Lean Angle, Brake Pressure, Throttle Trace)',
            th: 'M GPS Laptrigger + ดาต้าล็อกเกอร์ บันทึกองศาเอียง แรงดันเบรก และตำแหน่งคันเร่ง',
            zh: 'M GPS 自动计时器 + 倾角、刹车压力与油门开度全数据记录',
          },
        },
      ],
    },
    {
      id: 'kawasaki-zx6r',
      slug: 'kawasaki-zx6r',
      name: 'Kawasaki Ninja ZX-6R 636 Track Pack',
      year: 2025,
      classTag: 'SUPERSPORT',
      featuredBadge: {
        en: 'BEST VALUE TRACK PROGRESSION',
        th: 'คุ้มค่าที่สุดสำหรับฝึกทักษะสนาม',
        zh: '高性价比进阶首选车型',
      },
      status: 'AVAILABLE',
      priceUsd: 690,
      whp: 126,
      weightKg: 178,
      displacement: '636cc Inline-4 Screamer',
      topSpeedKmh: 266,
      lapBuriram: '1:46.1',
      lapBira: '1:06.4',
      image: '/images/bike-zx6r.jpg',
      pitImage: '/images/pit-mechanic-team.jpg',
      tagline: {
        en: 'Forgiving 636cc inline-four screaming to 15,000 RPM—built for corner-speed mastery.',
        th: 'เครื่อง 4 สูบเรียง 636cc รอบจัดจ้าน คุมง่าย น้ำหนักเบา เหมาะที่สุดสำหรับการฝึกเข้าโค้งความเร็วสูง',
        zh: '经典的 636cc 直列四缸高转机器，轻盈灵巧，是练习弯道速度与磨膝进阶的完美利器。',
      },
      summary: {
        en: 'Whether it is your first track day in Thailand or you love carrying surgical mid-corner speed through technical chicanes, our race-faired Ninja ZX-6R delivers confidence-inspiring feedback all day without fatiguing the rider.',
        th: 'ไม่ว่าจะเป็นแทร็กเดย์ครั้งแรกในไทย หรือสายเน้นความเร็วในโค้งเทคนิค Ninja ZX-6R สเปกแฟริ่งสนามคันนี้ให้ความแม่นยำสูง ขี่สนุกตลอดทั้งวันไม่เหนื่อยล้า พร้อมทีมช่างดูแลครบเหมือนรุ่นใหญ่ทุกประการ',
        zh: '无论是首次体验泰国赛道日，还是追求技术型弯道的极致弯速，这台全赛化改装 ZX-6R 都能带来极佳信心与轻松体力负担，同样享受全套技师与维修站待遇。',
      },
      includedHighlights: {
        en: [
          'Full pit crew mechanic support identical to our 1000cc superbike fleet',
          'Enclosed van transport to track + air-conditioned pit box station',
          'Pirelli Diablo Superbike slicks + digital tire warmers before every session',
          'KQS quickshifter, slipper clutch, race rearsets & lap timer installed',
          'Complimentary circuit line briefing for first-time Thailand track visitors',
        ],
        th: [
          'ทีมช่างเรซซิ่งดูแลเต็มรูปแบบมาตรฐานเดียวกับรถคลาส 1000cc ทุกคัน',
          'รถตู้ทึบขนส่งถึงสนาม + ห้องพิตบ็อกซ์แอร์ + สแตนด์และผ้าวอร์มยางครบชุด',
          'ยางสลิค Pirelli Diablo Superbike อุ่นร้อนพร้อมลงสนามทุกเซสชัน',
          'ควิกชิฟเตอร์ KQS สลิปเปอร์คลัตช์ เกียร์โยงสนาม และตัวจับเวลาต่อรอบ',
          'แนะนำไลน์สนามและจุดเบรกเบื้องต้นฟรีสำหรับผู้มาขี่สนามในไทยครั้งแรก',
        ],
        zh: [
          '享受与公升级旗舰完全相同的专属赛事技师与空调维修站礼遇',
          '专车往返运输 + 前后起车架 + 数码暖胎器全程伺候',
          '倍耐力光头胎每节预热，抓地力安心可靠',
          '配备电子快排、滑动离合、竞技脚踏及单圈计时器',
          '首次来泰下赛道的骑士可获免费赛道走线与刹车点讲解',
        ],
      },
      riderNotes: {
        en: [
          'Ideal for intermediate road riders stepping onto full race slicks',
          'Full leather suit, boots, gloves & FIM carbon helmet rental available ($95/day)',
          'Fuel & circuit entry fee billed transparently at track cost',
        ],
        th: [
          'เหมาะอย่างยิ่งสำหรับผู้ขี่บิ๊กไบค์ถนนที่ต้องการก้าวสู่รถแข่งยางสลิคเต็มตัว',
          'มีบริการเช่าชุดเรซซิ่งสูทหนัง รองเท้า ถุงมือ และหมวกคาร์บอนครบชุด ($95/วัน)',
          'ค่าน้ำมันและค่าลงสนามคิดตามจริงหน้างานไม่มีบวกเพิ่ม',
        ],
        zh: [
          '非常适合希望体验全套热熔光头胎与专业赛车的进阶骑士',
          '提供连体皮衣、赛用靴、手套与碳纤维头盔租赁服务（$95/天）',
          '燃油与赛道日费用透明实报实销',
        ],
      },
      buildSheet: [
        {
          category: { en: 'Engine & Exhaust', th: 'เครื่องยนต์และท่อไอเสีย', zh: '引擎与排气' },
          detail: {
            en: '636cc Inline-4 Race Flash (126 WHP), Akrapovič Slip-On & Link Pipe, Race Air Filter',
            th: '636cc 4 สูบเรียง รีแมพสนาม 126 WHP, ท่อ Akrapovič เรซซิ่ง, กรองอากาศแต่ง',
            zh: '636cc 直列四缸特调程序（轮上 126 匹），天蝎赛用排气与高流量空滤',
          },
        },
        {
          category: { en: 'Suspension', th: 'ระบบช่วงล่าง', zh: '悬挂调校' },
          detail: {
            en: 'Showa SFF-BP Re-Valved Track Forks, Öhlins Steering Damper, Race Rear Shock Linkage',
            th: 'โช้คหน้า Showa SFF-BP เซ็ตน้ำมันและสปริงสนาม, กันสะบัด Öhlins แท้',
            zh: 'Showa SFF-BP 赛道重设前叉 + Öhlins 赛用方向阻尼器',
          },
        },
        {
          category: { en: 'Braking', th: 'ระบบเบรก', zh: '制动升级' },
          detail: {
            en: 'Nissin Radial Monobloc Calipers, SBS Dual Carbon Race Pads, Steel Braided Lines',
            th: 'ปั๊มเรเดียลโมโนบล็อก ผ้าเบรกเรซซิ่ง SBS Dual Carbon สายถักเหล็กทั้งคัน',
            zh: '辐射一体卡钳，SBS Dual Carbon 碳陶赛用刹车片，全车钢喉',
          },
        },
        {
          category: { en: 'Track Ergonomics', th: 'ชุดแต่งสนาม', zh: '赛化人体工学' },
          detail: {
            en: 'CRC Fiberglass/Carbon Race Bodywork, GB Racing Engine Covers, AiM Solo 2 Lap Timer',
            th: 'แฟริ่งสนามน้ำหนักเบา, การ์ดแคร้งเครื่อง GB Racing แท้, ตัวจับเวลา AiM Solo 2',
            zh: '轻量化赛用整流罩、GB Racing 引擎护盖、AiM Solo 2 圈速表',
          },
        },
      ],
    },
  ],
};

export const THAI_CIRCUITS: ThaiCircuit[] = [
  {
    id: 'chang-buriram',
    name: {
      en: 'Chang International Circuit',
      th: 'สนามช้าง อินเตอร์เนชั่นแนล เซอร์กิต',
      zh: '武里南国际赛车场 (Chang MotoGP)',
    },
    location: {
      en: 'Buriram · Official MotoGP & WorldSBK Host Venue',
      th: 'จ.บุรีรัมย์ · สนามแข่งขัน MotoGP และ WorldSBK ระดับโลก',
      zh: '泰国武里南府 · MotoGP 与 WSBK 官方分站赛举办地',
    },
    grade: 'FIM GRADE A',
    lengthKm: '4.554 KM',
    turns: 12,
    straightM: 1000,
    transferFromBkk: {
      en: '50-min domestic flight from Bangkok (BKK/DMK) — your bike awaits ready in Pit Box',
      th: 'บินจากกรุงเทพฯ เพียง 50 นาที ตัวเปล่าเข้าพิตบ็อกซ์ รถแข่งพร้อมขี่ทันที',
      zh: '曼谷直飞仅需 50 分钟，抵达赛场维修站即可拎包上车',
    },
    image: '/images/circuit-chang-buriram.jpg',
    secondaryImage: '/images/circuit-buriram-real.jpg',
    description: {
      en: 'Designed by Hermann Tilke with world-standard runoff zones, 1,000m high-speed straight reaching 300+ km/h on our 1000cc machines, sweeping fast sector 2 corners, and grandstands overlooking every turn.',
      th: 'ออกแบบโดย Hermann Tilke มาตรฐานสูงสุด FIM Grade A ทางตรงยาว 1,000 เมตรทำความเร็วทะลุ 300 กม./ชม. พื้นผิวแทร็กเรียบกริบ โค้งความเร็วสูงต่อเนื่องปลอดภัยด้วยพื้นที่ Run-off กว้างขวาง',
      zh: '由 F1 赛道大师 Hermann Tilke 设计，FIM 最高 A 级认证。拥有长达 1,000 米的大直道（公升级赛车极速破 300km/h）与宽阔缓冲区，柏油抓地力极佳。',
    },
    nextDates: ['Nov 07–08, 2026', 'Nov 28–29, 2026', 'Dec 12–13, 2026'],
  },
  {
    id: 'bira-pattaya',
    name: {
      en: 'Bira International Circuit',
      th: 'พีระ อินเตอร์เนชั่นแนล เซอร์กิต พัทยา',
      zh: '芭提雅 Bira 国际赛车场',
    },
    location: {
      en: 'Chonburi / Pattaya · Classic Elevation Track',
      th: 'ชลบุรี - พัทยา · สนามคลาสสิกเล่นระดับเนินเขา',
      zh: '春武里 / 芭提雅 · 热带起伏山势技术型赛道',
    },
    grade: 'FIA / FMSCT',
    lengthKm: '2.410 KM',
    turns: 11,
    straightM: 580,
    transferFromBkk: {
      en: '90 mins from Bangkok Suvarnabhumi Airport · 20 mins from Pattaya beachfront hotels',
      th: 'ห่างสนามบินสุวรรณภูมิเพียง 90 นาที และเพียง 20 นาทีจากโรงแรมริมหาดพัทยา',
      zh: '距曼谷素万那普机场仅 90 分钟车程，距芭提雅海滩酒店仅 20 分钟',
    },
    image: '/images/circuit-bira-pattaya.jpg',
    secondaryImage: '/images/circuit-thailand-grandstand.jpg',
    description: {
      en: 'Thailand’s legendary technical circuit packed with dramatic elevation changes, blind crest entries, and fast flowing chicanes. Easy single-day or weekend escape combinable with Pattaya luxury resorts.',
      th: 'สนามแข่งระดับตำนานใกล้กรุงเทพฯ และพัทยา โดดเด่นด้วยเนินขึ้น-ลงสุดท้าทาย โค้งชิเคนต่อเนื่องที่ฝึกทักษะการพลิกรถได้อย่างยอดเยี่ยม เหมาะทั้งซ้อมแบบไปเช้า-เย็นกลับ หรือพักผ่อนสุดสัปดาห์ที่พัทยา',
      zh: '泰国最具驾驶乐趣的经典技术型赛道，拥有丰富的上下坡起伏与高速连续 S 弯，可完美结合曼谷/芭提雅度假行程，随时预约单日包场或公开练习日。',
    },
    nextDates: ['Oct 25, 2026', 'Nov 01, 2026', 'Nov 14–15, 2026', 'Every Wed / Sat Open Practice'],
  },
  {
    id: 'thailand-circuit',
    name: {
      en: 'Thailand Circuit Motorsport Complex',
      th: 'ไทยแลนด์ เซอร์กิต มอเตอร์สปอร์ต คอมเพล็กซ์',
      zh: '佛统府泰国赛车运动中心 (Nakhon Chai Si)',
    },
    location: {
      en: 'Nakhon Chai Si · Closest Circuit to Central Bangkok',
      th: 'อ.นครชัยศรี จ.นครปฐม · ใกล้ใจกลางกรุงเทพฯ ที่สุด',
      zh: '佛统府 · 距离曼谷市中心最近的专业摩托赛道',
    },
    grade: 'FMSCT PRO',
    lengthKm: '2.500 KM',
    turns: 13,
    straightM: 650,
    transferFromBkk: {
      en: 'Only 55 mins West of Downtown Bangkok — ideal for half-day or full-day testing',
      th: 'ขับรถจากใจกลางกรุงเทพฯ เพียง 55 นาที สะดวกที่สุดสำหรับการซ้อมและเช็คเซ็ตอัพรถ',
      zh: '从曼谷市区出发仅需 55 分钟，最适合紧凑行程的单日特训与试车',
    },
    image: '/images/circuit-thailand-grandstand.jpg',
    secondaryImage: '/images/pit-mechanic-team.jpg',
    description: {
      en: 'Technical 13-corner layout famous for building trail-braking precision, late-apex body positioning, and explosive exit drive—making our Yamaha R9 and Ninja ZX-6R absolute weapons here.',
      th: 'เลย์เอาต์ 13 โค้งเทคนิคที่ขึ้นชื่อเรื่องการฝึก Trail Braking การจัดท่าทางร่างกาย และการเปิดคันเร่งออกจากโค้งแคบ ทำให้รถอย่าง Yamaha R9 และ ZX-6R ขี่สนุกและคล่องตัวสุดขีด',
      zh: '拥有 13 个紧凑技术弯角，专为打磨循迹刹车（Trail Braking）、侧挂姿态与出弯油门控制而生，Yamaha R9 在此堪称弯道利器。',
    },
    nextDates: ['Oct 28, 2026', 'Nov 04, 2026', 'Nov 21–22, 2026'],
  },
];

export const INCLUDED_COMPARISON = {
  included: {
    en: [
      {
        title: 'Dedicated Pro Race Mechanic All Day',
        desc: 'Not just drop-off—your technician adjusts Öhlins sag, damping clicks, chain tension & hot tire pressures after every single session.',
      },
      {
        title: 'Round-Trip Enclosed Race Van Logistics',
        desc: 'Zero trailer hassle. Your bike arrives race-prepped inside our private air-conditioned pit box before you even put your helmet on.',
      },
      {
        title: 'Digital Tire Warmers & Pit Hardware',
        desc: 'Pirelli Diablo Superbike slicks heated to 80°C before pit exit so you have full race grip from Turn 1, Lap 1.',
      },
      {
        title: 'AiM GPS Lap Timer & Telemetry Review',
        desc: 'Every machine logs sector splits and peak speeds so you can track real lap-time drops across the day.',
      },
      {
        title: 'Multilingual Pit Hospitality (EN / ไทย / 中文)',
        desc: 'Cold electrolyte drinks, ice towels, seating lounge, track registration assistance, and clear communication in English, Thai, or Mandarin.',
      },
    ],
    th: [
      {
        title: 'ทีมช่างเรซซิ่งมืออาชีพดูแลประจำรถตลอดวัน',
        desc: 'ไม่ใช่แค่ส่งรถแล้วจบ ช่างของเราปรับเซ็ตโช้ค Öhlins ความตึงโซ่ และเช็กลมยางร้อนหลังจบทุกเซสชัน',
      },
      {
        title: 'บริการขนส่งรถแข่งตู้ทึบไป-กลับถึงพิตบ็อกซ์',
        desc: 'ไม่ต้องเหนื่อยขนย้ายรถเอง รถแข่งทุกคันจอดรอพร้อมซ้อมในห้องพิตบ็อกซ์ติดแอร์ก่อนคุณเดินทางถึงสนาม',
      },
      {
        title: 'ผ้าวอร์มยางดิจิทัล 80°C และอุปกรณ์พิตครบชุด',
        desc: 'ยางสลิค Pirelli ถูกอุ่นร้อนได้อุณหภูมิทำงานก่อนลงสนามทุกรอบ มั่นใจในความหนึบตั้งแต่โค้งแรก',
      },
      {
        title: 'เครื่องจับเวลา AiM GPS และการวิเคราะห์เวลาต่อรอบ',
        desc: 'รถทุกคันติดตั้งตัวจับเวลาผ่านดาวเทียม ดูพัฒนาการเวลาต่อรอบและความเร็วสูงสุดได้ชัดเจน',
      },
      {
        title: 'ดูแลสื่อสารครบ 3 ภาษา (ไทย / อังกฤษ / จีน)',
        desc: 'บริการเครื่องดื่มเกลือแร่ ผ้าเย็น ที่นั่งพักนักแข่ง ช่วยประสานงานสมัครลงสนามครบวงจร',
      },
    ],
    zh: [
      {
        title: '全天专属赛事技师驻场跟车服务',
        desc: '绝非简单交车了事——每节练习后技师均为您检查热胎压、调整 Öhlins 阻尼参数与链条状态。',
      },
      {
        title: '封闭式专业赛车运输车往返接送',
        desc: '无需操心拖车物流，抵达赛场空调维修站时赛车已完成整备静候发车。',
      },
      {
        title: '80°C 数码恒温暖胎器与全套维修站设备',
        desc: '倍耐力热熔光头胎提前预热至最佳工作温度，出站第一弯即拥有满格抓地力。',
      },
      {
        title: 'AiM GPS 卫星圈速仪与分段数据分析',
        desc: '全系标配高精度圈速记录，清晰见证每一节练习的单圈提升。',
      },
      {
        title: '中 / 泰 / 英三语无障碍赛道接待',
        desc: '提供冰镇电解质饮品、冰毛巾、休息区及赛道日报名协助，中国骑士来泰零语言障碍。',
      },
    ],
  },
  addons: {
    en: [
      { name: 'Brand-New Pirelli Diablo Superbike Slick Set (Installed)', priceUsd: 420, unit: 'per set' },
      { name: 'Full Pro Leather Suit, Boots, Gloves & FIM Carbon Helmet', priceUsd: 95, unit: 'per day' },
      { name: '4K Onboard Dual-Angle GoPro + Telemetry Overlay Video', priceUsd: 65, unit: 'per day' },
      { name: '1-on-1 Championship Racer Lead-Follow Track Coaching', priceUsd: 350, unit: 'per day' },
    ],
    th: [
      { name: 'ยางสลิค Pirelli Diablo Superbike คู่ใหม่แกะกล่อง (พร้อมถ่วงใส่)', priceUsd: 420, unit: 'ต่อชุด' },
      { name: 'เช่าชุดเรซซิ่งสูทหนัง รองเท้าบูท ถุงมือ และหมวกคาร์บอน FIM', priceUsd: 95, unit: 'ต่อวัน' },
      { name: 'แพ็กเกจกล้อง 4K หน้า-หลัง พร้อมกราฟความเร็วและองศาเอียง', priceUsd: 65, unit: 'ต่อวัน' },
      { name: 'โค้ชนักแข่งแชมป์ประเทศไทยขี่นำ-ตามปรับไลน์ตัวต่อตัว', priceUsd: 350, unit: 'ต่อวัน' },
    ],
    zh: [
      { name: '全新倍耐力 Diablo Superbike 热熔光头胎一套（含拆装动平衡）', priceUsd: 420, unit: '每套' },
      { name: '专业连体皮衣 + 赛用靴 + 手套 + 碳纤维头盔全套护具租赁', priceUsd: 95, unit: '每天' },
      { name: '前后双机位 4K 第一视角运动相机录制（含速度倾角仪表合成）', priceUsd: 65, unit: '每天' },
      { name: '冠军级职业车手一对一领骑跟拍私教指导', priceUsd: 350, unit: '每天' },
    ],
  },
};

export const FAQS: { q: LocalizedText; a: LocalizedText }[] = [
  {
    q: {
      en: 'Do I need a racing license to rent a track bike in Thailand?',
      th: 'ต้องมีใบอนุญาตนักแข่ง (Racing License) ถึงจะเช่าขี่ในสนามได้หรือไม่?',
      zh: '在泰国租车下赛道需要专业赛车执照吗？',
    },
    a: {
      en: 'No racing license is required for open track days at Bira Circuit, Thailand Circuit, or Chang International Circuit public track weekends. Riders are grouped by pace (Novice, Intermediate, Fast, Pro) so everyone rides safely at their own speed.',
      th: 'ไม่จำเป็นต้องมีใบอนุญาตนักแข่งสำหรับวันซ้อม Open Track Day ทั้งที่สนามพีระฯ ไทยแลนด์เซอร์กิต และสนามช้างฯ โดยทางสนามจะแบ่งกลุ่มตามความเร็ว (มือใหม่ / ปานกลาง / เร็ว / นักแข่ง) เพื่อความปลอดภัยสูงสุด',
      zh: '公开赛道日（Open Track Day）无需赛车执照即可参加！现场按圈速分为新手组、进阶组、快组与专业组，安全有序。',
    },
  },
  {
    q: {
      en: 'What exactly is included in the daily bike rental price, and what is extra?',
      th: 'ราคาเช่ารายวันรวมอะไรบ้าง และมีค่าใช้จ่ายส่วนใดเพิ่มเติม?',
      zh: '每日租车价格具体包含哪些内容？还有哪些额外费用？',
    },
    a: {
      en: 'Your rental rate includes the full race-prepared motorcycle, a dedicated pit mechanic all day, enclosed transport to and from the circuit, air-conditioned pit box bay, paddock stands, tire warmers, good-condition slick tires, and pit refreshments. Only fuel consumed, circuit track-day pass (~$65–$160 depending on circuit), and optional fresh slicks/gear are separate—or we can quote a single 100% all-in price on WhatsApp.',
      th: 'ราคาเช่ารวมตัวรถแข่งแต่งเต็ม ช่างประจำรถตลอดวัน รถขนส่งไป-กลับสนาม ห้องพิตบ็อกซ์แอร์ ผ้าวอร์มยาง ยางสลิคสภาพพร้อมใช้งาน และเครื่องดื่มในพิต ส่วนที่แยกตามจริงมีเพียงค่าน้ำมัน ค่าสมัครลงสนาม (ประมาณ 2,200–5,500 บาทตามสนาม) และออปชันเสริม เช่น ยางสลิคคู่ใหม่หรือชุดแข่ง หรือให้เราสรุปเป็นราคาเหมาจ่ายรวมครบจบในยอดเดียวทาง WhatsApp ได้ทันที',
      zh: '日租金已包含：全改装赛车使用权、专属技师全天服务、往返赛道封闭拖车、空调维修站车位、暖胎器、状态良好的光头胎及冷饮补给。仅实际消耗的汽油与赛道门票（视场地约 $65–$160）实报实销，您也可以联系微信/WhatsApp 选择一价全包套餐。',
    },
  },
  {
    q: {
      en: 'How does crash damage deposit / rider liability work?',
      th: 'กรณีเกิดอุบัติเหตุล้มในสนาม มีเงื่อนไขความรับผิดชอบอย่างไร?',
      zh: '如果在赛道发生摔车，押金与赔偿上限如何计算？',
    },
    a: {
      en: 'Every bike is fitted with carbon frame sliders, GB Racing engine protection covers, and fiberglass/carbon track fairings to keep minor lowside repairs minimal. A transparent, capped refundable security deposit is agreed before riding, and any parts needed are charged strictly at wholesale replacement cost—never inflated retail prices.',
      th: 'รถทุกคันติดตั้งการ์ดแคร้ง GB Racing กันล้ม และแฟริ่งสนามซึ่งซ่อมบำรุงง่ายกว่าแฟริ่งถนนมาก เรามีการตกลงวงเงินมัดจำและเพดานความรับผิดชอบสูงสุดไว้อย่างชัดเจนก่อนขี่ หากมีอะไหล่เสียหายคิดตามราคาต้นทุนจริงเท่านั้น ไม่มีการบวกราคาเกินจริง',
      zh: '所有赛车均装有 GB Racing 防摔护盖与赛用包围以大幅降低滑摔损失。发车前签署透明封顶免赔协议，任何受损配件仅按成本价实算，绝无高额索赔套路。',
    },
  },
  {
    q: {
      en: 'Can I book for a group of friends flying into Bangkok or Pattaya?',
      th: 'สามารถจองเหมาหลายคันสำหรับก๊วนเพื่อนบินมาขี่ด้วยกันได้หรือไม่?',
      zh: '我们可以几个朋友组团飞来曼谷或武里南包维修站吗？',
    },
    a: {
      en: 'Yes! Up to 6 superbikes can be reserved together with a private air-conditioned pit box, airport hotel transfer assistance, multi-bike group discount (-10% to -15%), and dedicated photographer/videographer coverage.',
      th: 'ได้แน่นอน! รองรับกลุ่มเพื่อนสูงสุด 6 คัน พร้อมเปิดห้องพิตบ็อกซ์ส่วนตัว บริการช่วยดูแลรถรับ-ส่งสนามบิน-โรงแรม ส่วนลดกลุ่ม 10%–15% และช่างภาพถ่ายรูป-วิดีโอประจำทีม',
      zh: '完全可以！支持最多 6 台赛车团队预订，享独立私人空调维修站、机场酒店接送协助、团购 85–90 折优惠及专属赛道摄影跟拍服务。',
    },
  },
];

export const UI_STRINGS = {
  nav: {
    fleet: { en: 'Race Fleet', th: 'รถแข่งให้เช่า', zh: '赛车阵容' },
    included: { en: "What's Included", th: 'สิ่งที่รวมในแพ็กเกจ', zh: '服务包含' },
    circuits: { en: 'Thai Circuits', th: 'สนามแข่งในไทย', zh: '泰国赛道' },
    faq: { en: 'FAQ', th: 'คำถามพบบ่อย', zh: '常见问题' },
    bookNow: { en: 'Book Track Day', th: 'จองคิวลงสนาม', zh: '立即预订赛道日' },
  },
  hero: {
    ctaPrimary: { en: 'Explore Fleet & Pricing', th: 'ดูรุ่นรถและราคาเช่า', zh: '查看车型与报价' },
    ctaWhatsapp: { en: 'Book on WhatsApp', th: 'ทักจองผ่าน WhatsApp', zh: 'WhatsApp 极速预订' },
    reelTrack: { en: 'LIVE TRACK REEL', th: 'วิดีโอในสนามแข่ง', zh: '赛道实拍大片' },
    reelPov: { en: 'COCKPIT POV', th: 'มุมมองนักแข่ง POV', zh: '第一视角 POV' },
    reelCustom: { en: 'OWNER CUSTOM VIDEO', th: 'วิดีโอเจ้าของแบรนด์', zh: '自定义视频' },
    statBikes: { en: '6 Factory Race Builds', th: '6 รถแข่งสเปกสนามแท้', zh: '6 台专业改装赛车' },
    statCrew: { en: '1:1 Pit Mechanic Included', th: 'รวมช่างเรซซิ่งดูแล 1:1', zh: '含 1对1 专属赛事技师' },
    statLangs: { en: 'EN · ไทย · 中文 Track Support', th: 'ดูแลสื่อสาร ไทย · EN · จีน', zh: '中 / 泰 / 英三语驻场接待' },
  },
  fleetSection: {
    eyebrow: { en: 'RACE-PREPARED FLEET & TRANSPARENT RATES', th: 'กองทัพรถแข่งสเปกสนามพร้อมราคาโปร่งใส', zh: '全赛化改装机车阵容与透明报价' },
    heading: { en: 'CHOOSE YOUR WEAPON', th: 'เลือกรถแข่งคู่ใจของคุณ', zh: '选择您的赛道战车' },
    subheading: {
      en: 'Every machine arrives track-ready inside your pit box on pre-heated Pirelli slicks with full suspension & mechanic support included.',
      th: 'รถทุกคันจอดรอพร้อมซ้อมในห้องพิตบ็อกซ์ อุ่นยางสลิค Pirelli ร้อนได้ที่ พร้อมทีมช่างปรับเซ็ตช่วงล่างให้ตลอดวัน',
      zh: '每台赛车均提前运抵维修站并使用暖胎器预热光头胎，每日租金已含专属技师全程调校服务。',
    },
    filterAll: { en: 'All Machines (6)', th: 'ทั้งหมด (6 คัน)', zh: '全部车型 (6)' },
    filterSupersport: { en: 'Supersport 600–900', th: 'ซูเปอร์สปอร์ต 600–900cc', zh: '中量级超跑 600–900' },
    filterLiter: { en: '1000cc+ Superbikes', th: 'ซูเปอร์ไบค์ 1000cc+', zh: '公升级旗舰 1000cc+' },
    perDay: { en: '/ day · Mechanic Included', th: '/ วัน · รวมช่างและพิตบ็อกซ์', zh: '/ 天 · 含技师与维修站' },
    whatsIncludedToggle: { en: "What's Included", th: 'ดูสิ่งที่รวมให้แล้ว', zh: '查看包含项目' },
    hideIncludedToggle: { en: 'Hide Details', th: 'ซ่อนรายละเอียด', zh: '收起详情' },
    viewBikePage: { en: 'Full Spec & Bike Page', th: 'ดูสเปกละเอียดเต็มหน้า', zh: '查看完整改装详情页' },
    bookThisBike: { en: 'Book Now', th: 'จองคันนี้', zh: '预订此车' },
  },
  includedSection: {
    eyebrow: { en: 'ZERO HIDDEN SURPRISES · ARRIVE & RIDE PROTOCOL', th: 'โปร่งใส ไม่มีบวกเพิ่มแอบแฝง · มาตัวเปล่าพร้อมขี่', zh: '零隐形消费 · 拎包下赛道全包体验' },
    heading: { en: 'EVERYTHING IN YOUR PIT BOX, HANDLED.', th: 'เราดูแลเรื่องรถและทีมพิต คุณโฟกัสแค่การขี่', zh: '专业车队级后勤保障，您只需专注驾驶' },
    includedColTitle: { en: 'INCLUDED IN EVERY DAILY RENTAL', th: 'รวมอยู่ในค่าเช่ารถทุกคันแล้ว', zh: '每日租车费用已全部包含' },
    addonsColTitle: { en: 'OPTIONAL UPGRADES & ADD-ONS', th: 'ออปชันเสริมเลือกเพิ่มได้ตามต้องการ', zh: '可选升级服务与装备租赁' },
  },
  circuitsSection: {
    eyebrow: { en: 'WHERE WE RIDE IN THAILAND', th: 'สนามแข่งขันชั้นนำในประเทศไทย', zh: '全泰三大合作专业赛车场' },
    heading: { en: 'FROM MOTOGP TARMAC TO TECHNICAL CHICANES', th: 'เลือกสนามแข่งระดับโลกได้ตามทริปของคุณ', zh: '从 MotoGP 国际赛道到曼谷周边技术赛道' },
    selectCircuitBtn: { en: 'Book Track Day Here', th: 'จองเช่ารถขี่สนามนี้', zh: '预订此赛道档期' },
    nextTrackDaysLabel: { en: 'UPCOMING DATES:', th: 'รอบวันซ้อมถัดไป:', zh: '近期可约档期：' },
  },
  bookingSection: {
    eyebrow: { en: 'INSTANT BOOKING & ENQUIRY DESK', th: 'ระบบคำนวณราคาและจองคิวลงสนามทันที', zh: '在线算价与一键快速预订通道' },
    heading: { en: 'RESERVE YOUR TRACK MACHINE', th: 'สำรองรถแข่งและวันซ้อมของคุณ', zh: '锁定您的专属赛车与档期' },
    sub: {
      en: 'Configure your bike, circuit, and dates below—then send instantly via WhatsApp, Facebook Messenger, or our direct pit desk form.',
      th: 'เลือกรุ่นรถ สนามแข่ง และวันที่ต้องการด้านล่าง ส่งข้อมูลจองทันทีทาง WhatsApp, Messenger หรือกรอกฟอร์มให้ทีมงานติดต่อกลับภายใน 15 นาที',
      zh: '在下方选择车型、赛道与日期，实时查看总价，一键发送至 WhatsApp / Messenger 或提交表单，车队中文客服 15 分钟内极速响应。',
    },
    selectBike: { en: '1. Select Race Bike', th: '1. เลือกรุ่นรถแข่ง', zh: '1. 选择赛道车型' },
    selectCircuit: { en: '2. Select Circuit', th: '2. เลือกสนามแข่ง', zh: '2. 选择目标赛道' },
    selectDays: { en: '3. Rental Duration', th: '3. จำนวนวันที่เช่าขี่', zh: '3. 租赁天数套餐' },
    day1: { en: '1 Day Arrive & Ride', th: 'เช่าขี่ 1 วันเต็ม', zh: '1 天单日畅跑' },
    day2: { en: '2-Day Weekend (-10%)', th: 'แพ็กเกจ 2 วัน (-10%)', zh: '2 天周末连跑 (9折)' },
    day3: { en: '3-Day Pro Camp (-15%)', th: 'แพ็กเกจ 3 วัน (-15%)', zh: '3 天深度特训 (85折)' },
    preferredDate: { en: 'Preferred Track Date', th: 'วันที่ต้องการลงสนาม', zh: '计划下赛道日期' },
    riderName: { en: 'Your Name', th: 'ชื่อ-นามสกุลผู้ขี่', zh: '您的姓名 / 称呼' },
    riderContact: { en: 'WhatsApp / Email / LINE / WeChat', th: 'เบอร์โทร / WhatsApp / LINE / อีเมล', zh: '微信号 / WhatsApp / 电话 / 邮箱' },
    riderWeight: { en: 'Rider Weight (kg) — for Öhlins Setup', th: 'น้ำหนักตัวผู้ขี่ (กก.) เพื่อเซ็ตโช้ค Öhlins', zh: '骑士体重 (kg，用于提前设定 Öhlins 弹簧预载)' },
    riderLevel: { en: 'Track Experience Tier', th: 'ระดับประสบการณ์ในสนาม', zh: '赛道驾驶经验等级' },
    levels: {
      novice: { en: 'First Track Day / Fast Canyon Rider', th: 'มือใหม่ลงสนามครั้งแรก / ขี่ถนนคล่อง', zh: '首次下赛道 / 跑山进阶骑士' },
      inter: { en: 'Intermediate Track Day Rider', th: 'ปานกลาง เคยลงซ้อมสนามมาแล้ว', zh: '中级（有过赛道日经验）' },
      fast: { en: 'Fast Group / Club Racer', th: 'กลุ่มเร็ว / นักแข่งคลับเรซ', zh: '快组 / 俱乐部车手水平' },
    },
    notesPlaceholder: {
      en: 'Any special requests? (GP shift pattern, suit size, airport transfer, group booking...)',
      th: 'ระบุความต้องการเพิ่มเติม เช่น เกียร์โยง GP Shift, ไซส์ชุดแข่ง, จำนวนเพื่อนร่วมทริป...',
      zh: '其他定制需求（如反档设置、皮衣尺码、同行人数、全包报价需求等）...',
    },
    estimatedTotal: { en: 'ESTIMATED PACKAGE TOTAL', th: 'ยอดประมาณการแพ็กเกจรวม', zh: '套餐预估总计' },
    sendWhatsapp: { en: 'Book Instantly via WhatsApp', th: 'ส่งรายละเอียดจองทาง WhatsApp', zh: '通过 WhatsApp 一键发送预订' },
    sendMessenger: { en: 'Book via FB Messenger', th: 'ทักจองผ่าน Facebook Messenger', zh: '通过 FB Messenger 预订' },
    submitForm: { en: 'Submit Direct Booking Enquiry', th: 'ส่งฟอร์มจองให้ทีมงานติดต่อกลับ', zh: '提交官网预订咨询单' },
    submittedTitle: { en: 'Booking Enquiry Logged — Pit Crew Notified!', th: 'รับข้อมูลการจองเรียบร้อย ทีมพิตได้รับเรื่องแล้ว!', zh: '预订咨询已提交，车队技师组已收到通知！' },
  },
  bikeDetail: {
    backToFleet: { en: 'Back to All Race Bikes', th: 'กลับไปหน้ารวมรถแข่งทั้งหมด', zh: '返回全部赛车列表' },
    buildSheetTitle: { en: 'FULL RACE PREPARATION SPEC SHEET', th: 'สเปกของแต่งและการเซ็ตอัพสนามเต็มระบบ', zh: '完整赛事级改装配置清单' },
    lapBenchmarks: { en: 'REFERENCE CIRCUIT BENCHMARKS', th: 'เวลาต่อรอบอ้างอิงของรถคันนี้', zh: '该车型泰国赛道参考圈速' },
    selectPackage: { en: 'SELECT PACKAGE TIER', th: 'เลือกรูปแบบแพ็กเกจเช่าขี่', zh: '选择租赁天数方案' },
  },
};
