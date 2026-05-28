import { useState, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'IBM Plex Sans Thai','IBM Plex Sans',sans-serif;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:#1B3A7A;border-radius:3px;}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes in{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.7}}
.up{animation:up .3s ease both}
.in{animation:in .25s ease both}
.spin{animation:spin .8s linear infinite}
.ping{animation:ping 1.5s ease infinite}
input,select,textarea{font-family:inherit;}
button{font-family:inherit;}
`;

/* ─── TOKENS ────────────────────────────────────────────────────────────────── */
/* SAU Brand: Navy Blue #1B3A7A + Gold #C8973F */
const C = {
  /* Primary: SAU Navy Blue */
  g:"#1B3A7A", gd:"#122D63", gl:"#E8EDF8", gll:"#F0F4FC",
  /* Dark backgrounds */
  ink:"#0D1E42", mid:"#1B3A7A", text:"#1B2D50",
  /* Neutrals */
  mute:"#5C6E8A", faint:"#9BACC4",
  bg:"#F3F5FA", white:"#FFFFFF", border:"#D4DCF0",
  /* Accents */
  amber:"#C8973F", rose:"#D63B3B", sky:"#1A5FAD", teal:"#0D7A6E", violet:"#5A2D8C",
  /* SAU Gold */
  gold:"#C8973F", goldLight:"#FDF3E3", goldDark:"#A07230",
};

/* ─── SAU REAL DATA (จากโบรชัวร์จริง) ───────────────────────────────────────── */
const FACULTIES = [
  { id:"law", name:"คณะนิติศาสตร์", em:"⚖️", color:"#1A5FAD",
    phone:"02-807-4500", web:"www.sau.ac.th", lineOA:"@iamsau",
    branches:[
      {
        name:"นิติศาสตรบัณฑิต (น.บ.) ภาคปกติ",
        yrs:4, mode:"จันทร์–ศุกร์ (ปกติ)", fee:null,
        totalCredits:123, feeTotal:"133,800 บาท (ตลอดหลักสูตร)",
        note:"รับ ม.6, ปวช., ปวส., กศน. / เทียบโอนปริญญาตรีใบที่ 2 จบใน 2 ปี",
        careers:["ทนายความ","อัยการ","ผู้พิพากษา","นิติกร","ที่ปรึกษากฎหมาย"],
      },
      {
        name:"นิติศาสตรบัณฑิต (น.บ.) ภาคสมทบ (นักเรียนนายสิบตำรวจ)",
        yrs:2, mode:"เสาร์–อาทิตย์", fee:null,
        totalCredits:101, feeTotal:"ตามประกาศมหาวิทยาลัย",
        note:"สำหรับนักเรียนนายสิบตำรวจ เทียบโอนวิชาได้",
        careers:["ตำรวจ","นิติกร","นักกฎหมาย"],
      },
    ]},
  { id:"pub_bachelor", name:"คณะศิลปศาสตร์และวิทยาศาสตร์", em:"🏛️", color:"#7C3AED",
    phone:"098-554-5255", lineOA:"@iamsau",
    branches:[
      {
        name:"รัฐประศาสนศาสตรบัณฑิต (รป.บ.) Online Program",
        yrs:3.5, mode:"เสาร์–อาทิตย์ / Online Block Course", fee:185950,
        totalCredits:123, feeTotal:"185,950 บาท",
        note:"เรียนผ่าน Internet / Block Course / ไม่กระทบเวลาทำงาน",
        careers:["รับราชการ","ทหาร","ตำรวจ","ปลัดอำเภอ","ผู้บริหารท้องถิ่น"],
      },
      {
        name:"รัฐประศาสนศาสตรบัณฑิต (รป.บ.) เทียบโอนประสบการณ์",
        yrs:2, mode:"เสาร์–อาทิตย์ Block Course Hybrid", fee:99000,
        totalCredits:123, feeTotal:"99,000 บาท",
        note:"เทียบโอนได้สูงสุด 63 หน่วยกิต / ประสบการณ์งาน ≥ 5 ปี",
        careers:["รับราชการ","ปลัดเทศบาล","ผู้นำชุมชน","นักการเมืองท้องถิ่น"],
      },
      {
        name:"รัฐศาสตรบัณฑิต สาขาความสัมพันธ์ระหว่างประเทศ (Online)",
        yrs:3.5, mode:"Online / Block Course / เสาร์–อาทิตย์", fee:185950,
        totalCredits:123, feeTotal:"185,950 บาท",
        note:"เรียน Online ไม่กระทบเวลาทำงาน / Block Course",
        careers:["นักการทูต","ข้าราชการพลเรือน","ที่ปรึกษาระหว่างประเทศ","อาจารย์"],
      },
    ]},
  { id:"pub_master", name:"บัณฑิตวิทยาลัย (ป.โท)", em:"🎓", color:C.amber,
    phone:"087-502-7499", email:"graduate.sau.ac.th",
    branches:[
      {
        name:"MBA – บริหารธุรกิจมหาบัณฑิต (แผน 1 วิชาการ / แผน 2 วิชาชีพ)",
        yrs:1.5, mode:"วันอาทิตย์เต็มวัน Block Course System", fee:149000,
        totalCredits:36, feeTotal:"149,000 บาท",
        note:"แผน 1 วิชาการ (วิทยานิพนธ์ 12 หน่วยกิต) / แผน 2 วิชาชีพ (ค้นคว้าอิสระ 6 หน่วยกิต)",
        careers:["ผู้บริหารองค์กร","ผู้ประกอบการ","ที่ปรึกษาธุรกิจ","นักลงทุน"],
      },
      {
        name:"ศษ.ม. – ศึกษาศาสตรมหาบัณฑิต การบริหารการศึกษา",
        yrs:2, mode:"ทุกวันเสาร์–วันอาทิตย์ 08:30–16:30 น. Hybrid", fee:139000,
        totalCredits:42, feeTotal:"139,000 บาท",
        note:"แผน ก (วิทยานิพนธ์) / แผน ข (ค้นคว้าอิสระ) / เทียบโอนหน่วยกิตได้",
        careers:["ผู้บริหารสถานศึกษา","ศึกษานิเทศก์","นักวิชาการศึกษา"],
      },
      {
        name:"รป.ม. – รัฐประศาสนศาสตรมหาบัณฑิต (แผน 1 วิชาการ / แผน 2 วิชาชีพ)",
        yrs:2, mode:"วันเสาร์–วันอาทิตย์ Block Course Hybrid", fee:139000,
        totalCredits:36, feeTotal:"139,000 บาท (+ ค่าแรกเข้า 5,500 บาท)",
        note:"แผน 1 แบบวิชาการ / แผน 2 แบบวิชาชีพ / เทียบโอนได้",
        careers:["นักบริหารภาครัฐ","ผู้นำชุมชน","ข้าราชการระดับสูง"],
      },
    ]},
  { id:"phd", name:"บัณฑิตวิทยาลัย (ป.เอก)", em:"🏆", color:C.teal,
    phone:"02-807-4500 ต่อ 316,317", email:"bizschool@sau.ac.th",
    branches:[
      {
        name:"Ph.D. บริหารธุรกิจดุษฎีบัณฑิต (สาขาบริหารธุรกิจ)",
        yrs:3, mode:"วันอาทิตย์เต็มวัน Block Course", fee:78000,
        totalCredits:48, feeTotal:"468,000 บาท (ผ่อนชำระได้)",
        note:"แผน 1 (1.1) วิทยานิพนธ์ 48 หน่วยกิต / แผน 2 (2.1) วิทยานิพนธ์ 36 หน่วยกิต",
        careers:["นักวิชาการ","ผู้บริหารระดับสูง","ที่ปรึกษาองค์กร","อาจารย์มหาวิทยาลัย"],
      },
      {
        name:"ปร.ด. การบริหารการศึกษาดุษฎีบัณฑิต",
        yrs:3, mode:"วันเสาร์–อาทิตย์ Hybrid", fee:null,
        totalCredits:69, feeTotal:"468,000 บาท",
        note:"แผน ก (วิจัย) รวม 69 หน่วยกิต / Hybrid Learning System",
        careers:["ผู้บริหารการศึกษา","อาจารย์มหาวิทยาลัย","นักวิจัยการศึกษา"],
      },
      {
        name:"ปร.ด. รัฐประศาสนศาสตรดุษฎีบัณฑิต (NEW PROGRAM)",
        yrs:3, mode:"วันเสาร์–อาทิตย์ Hybrid", fee:null,
        totalCredits:48, feeTotal:"ตามประกาศมหาวิทยาลัย",
        note:"แผน 1 (1.1) วิทยานิพนธ์ 48 หน่วยกิต / แผน 2 (2.1) วิทยานิพนธ์ 36 หน่วยกิต",
        careers:["ผู้บริหารภาครัฐระดับสูง","นักวิจัยนโยบาย","ที่ปรึกษารัฐบาล"],
      },
    ]},
  { id:"diploma", name:"หลักสูตรประกาศนียบัตร", em:"📜", color:C.rose,
    phone:"081-803-8373",
    branches:[
      {
        name:"ป.บัณฑิต วิชาชีพครู (Graduate Diploma in Teaching Profession)",
        yrs:1.5, mode:"วันเสาร์–อาทิตย์ / ชั้นเรียน", fee:null,
        totalCredits:33, feeTotal:"60,000 บาท",
        note:"สำหรับผู้ขอรับใบประกอบวิชาชีพครูจากคุรุสภา / ปริญญาตรีทุกสาขา",
        careers:["ครู","อาจารย์","นักการศึกษา"],
      },
    ]},
];

const ADVISORS = [
  {
    name:"ผศ.ดร.ยอรช เสมอมิตร", dept:"บัณฑิตวิทยาลัย / นิติศาสตร์",
    avail:"อังคาร–อาทิตย์ 08:30–16:30 น.", phone:"081-803-8373",
    line:"@iamsau", slots:["09:00","10:00","11:00","13:00","14:00","15:00"],
  },
  {
    name:"ดร.ภาวัช รุจาฉันท์", dept:"รัฐประศาสนศาสตร์ / รัฐศาสตร์",
    avail:"จันทร์–ศุกร์ 08:30–16:30 น.", phone:"098-554-5255",
    line:"@iamsau", slots:["09:00","10:00","14:00","15:00","16:00"],
  },
  {
    name:"ดร.สมบัติ เดชบำรุง", dept:"ศึกษาศาสตร์ / บริหารการศึกษา",
    avail:"เสาร์–อาทิตย์ 08:30–16:30 น.", phone:"081-259-4329",
    line:"@iamsau", slots:["09:00","10:00","13:00","14:00","15:00"],
  },
  {
    name:"ดร.พนส์ พุทธานุกรน", dept:"MBA / รัฐประศาสนศาสตร์",
    avail:"จันทร์–ศุกร์ 09:00–17:00 น.", phone:"062-268-2323",
    line:"@iamsau", slots:["10:00","11:00","14:00","15:00","16:00"],
  },
];

const INIT_STU = [
  {id:"STU001",name:"สมชาย ใจดี",faculty:"คณะนิติศาสตร์",branch:"นิติศาสตรบัณฑิต (น.บ.) ภาคปกติ",yr:2,gpa:3.45,phone:"081-234-5678",email:"somchai@sau.ac.th",lineId:"@somchai",paid:true,slip:null,status:"กำลังศึกษา",advisor:"ผศ.ดร.ยอรช เสมอมิตร",attend:88,docs:[],notes:[],pdpa:true},
  {id:"STU002",name:"สมหญิง รักเรียน",faculty:"บัณฑิตวิทยาลัย (ป.โท)",branch:"MBA – บริหารธุรกิจมหาบัณฑิต (แผน 1 วิชาการ / แผน 2 วิชาชีพ)",yr:1,gpa:3.10,phone:"082-345-6789",email:"somying@sau.ac.th",lineId:"@somying",paid:false,slip:null,status:"กำลังศึกษา",advisor:"ดร.พนส์ พุทธานุกรน",attend:74,docs:[],notes:[],pdpa:true},
  {id:"STU003",name:"วิชัย เก่งมาก",faculty:"คณะศิลปศาสตร์และวิทยาศาสตร์",branch:"รัฐประศาสนศาสตรบัณฑิต (รป.บ.) Online Program",yr:3,gpa:3.78,phone:"083-456-7890",email:"wichai@sau.ac.th",lineId:"@wichai",paid:true,slip:"slip_3.jpg",status:"กำลังศึกษา",advisor:"ดร.ภาวัช รุจาฉันท์",attend:95,docs:["ใบสมัคร","สำเนาบัตรประชาชน"],notes:["ปรึกษาเรื่องเทียบโอน 10 พ.ค."],pdpa:true},
  {id:"STU004",name:"มานะ ขยันดี",faculty:"บัณฑิตวิทยาลัย (ป.เอก)",branch:"Ph.D. บริหารธุรกิจดุษฎีบัณฑิต (สาขาบริหารธุรกิจ)",yr:2,gpa:2.30,phone:"084-567-8901",email:"mana@sau.ac.th",lineId:"@mana",paid:false,slip:null,status:"กำลังศึกษา",advisor:"ดร.สมบัติ เดชบำรุง",attend:65,docs:[],notes:[],pdpa:false},
];

const INIT_PROSPECTS = [
  {id:"P001",name:"นายทดสอบ ระบบ",phone:"089-111-2222",lineId:"@test",province:"กรุงเทพฯ",interest:"นิติศาสตรบัณฑิต (น.บ.) ภาคปกติ",source:"Facebook",status:"สนใจข้อมูล",docs:[],date:"2026-05-01"},
  {id:"P002",name:"น.ส.ดวงใจ สุขสม",phone:"087-333-4444",lineId:"@duangjai",province:"เชียงใหม่",interest:"MBA – บริหารธุรกิจมหาบัณฑิต (แผน 1 วิชาการ / แผน 2 วิชาชีพ)",source:"LINE OA",status:"ส่งเอกสารแล้ว",docs:["Resume.pdf"],date:"2026-05-05"},
];

const NOTIFS_INIT = [
  {id:1,title:"แจ้งชำระค่าเทอม 2/2568",body:"กำหนดชำระภายใน 30 มิ.ย. 2568 ผ่านธนาคารหรือ QR Code ติดต่อ 02-807-4500",date:"2026-05-15",type:"payment",sent:4},
  {id:2,title:"กิจกรรมวันไหว้ครู 2568",body:"ขอเชิญนักศึกษาทุกท่านเข้าร่วมพิธีไหว้ครู ณ อาคารพลกฤษณ ประโมทะกา 08:30 น.",date:"2026-05-18",type:"event",sent:4},
  {id:3,title:"เปิดรับสมัครนักศึกษาใหม่ 2568",body:"SAU เปิดรับสมัครนักศึกษาทุกหลักสูตร ติดต่อ 02-807-4500 / LINE: @iamsau",date:"2026-05-01",type:"exam",sent:4},
];

/* ─── MINI ICON ─────────────────────────────────────────────────────────────── */
const P={
  home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  build:"M6 2h12v20H6z M9 7h6 M9 12h6 M9 17h6",
  book:"M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  wallet:"M21 12V7H5a2 2 0 010-4h14v4 M3 5v14a2 2 0 002 2h16v-5",
  users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87",
  bell:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  person:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chat:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  plus:"M12 5v14 M5 12h14",
  send:"M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  check:"M20 6L9 17l-5-5",
  x:"M18 6L6 18 M6 6l12 12",
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  file:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
  upload:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  swap:"M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 M12 9a3 3 0 100 6 3 3 0 000-6z",
  track:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  lock:"M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  alert:"M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  img:"M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z M8.5 13.5l2.5-3 2.5 3 M14 10.5l2.5 3",
};
const Ico=({n,s=16,c="currentColor"})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={P[n]||""}/>
  </svg>
);

/* ─── SMALL COMPONENTS ───────────────────────────────────────────────────────── */
const Chip=({text,type="def",sm})=>{
  const m={def:{b:"#EEF3F9",c:C.mute},ok:{b:"#E8EDF8",c:"#122D63"},warn:{b:"#FEF3C7",c:"#78350F"},bad:{b:"#FEE2E2",c:"#991B1B"},info:{b:"#DBEAFE",c:"#1E40AF"},green:{b:"#1B3A7A",c:"#fff"},purple:{b:"#EDE9FE",c:"#4C1D95"}};
  const s=m[type]||m.def;
  return <span style={{background:s.b,color:s.c,padding:sm?"2px 7px":"3px 10px",borderRadius:20,fontSize:sm?10:11,fontWeight:700,whiteSpace:"nowrap"}}>{text}</span>;
};

const Card=({ch,style={},onClick,accent})=>(
  <div onClick={onClick} style={{background:C.white,borderRadius:14,boxShadow:"0 1px 8px rgba(0,0,0,.055)",padding:16,marginBottom:10,borderLeft:accent?`4px solid ${accent}`:undefined,cursor:onClick?"pointer":"default",...style}}>
    {ch}
  </div>
);

const Btn=({ch,onClick,v="pri",sz="md",dis,ic,full,red,style:st={}})=>{
  const sv={pri:{bg:"linear-gradient(135deg,#1B3A7A,#0D1E42)",c:"#fff",br:"none"},sec:{bg:C.bg,c:C.text,br:`1px solid ${C.border}`},dark:{bg:C.ink,c:"#fff",br:"none"},red:{bg:"#FEE2E2",c:C.rose,br:"none"}};
  const ss={sm:{p:"7px 13px",fs:11},md:{p:"11px 17px",fs:13},lg:{p:"13px 22px",fs:15}};
  const vv=red?sv.red:sv[v]||sv.pri; const ss2=ss[sz]||ss.md;
  return(
    <button onClick={onClick} disabled={dis} style={{background:vv.bg,color:vv.c,border:vv.br,borderRadius:11,padding:ss2.p,fontSize:ss2.fs,fontWeight:700,cursor:dis?"not-allowed":"pointer",opacity:dis?.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,width:full?"100%":"auto",transition:"all .18s",...st}}>
      {ic&&<Ico n={ic} s={13} c={vv.c}/>}{ch}
    </button>
  );
};

const Inp=({label,val,set,type="text",ph,rows})=>(
  <div style={{marginBottom:12}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:C.mute,display:"block",marginBottom:4}}>{label}</label>}
    {rows
      ?<textarea value={val} onChange={e=>set(e.target.value)} placeholder={ph} rows={rows} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13,outline:"none",resize:"vertical"}}/>
      :<input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13,outline:"none"}}/>
    }
  </div>
);

const Sel=({label,val,set,opts})=>(
  <div style={{marginBottom:12}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:C.mute,display:"block",marginBottom:4}}>{label}</label>}
    <select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13,background:C.white,outline:"none"}}>
      {opts.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}
    </select>
  </div>
);

const Modal=({title,onClose,ch})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="up" style={{background:C.white,borderRadius:"18px 18px 0 0",padding:20,width:"100%",maxWidth:500,margin:"0 auto",maxHeight:"88vh",overflowY:"auto",boxSizing:"border-box"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.ink}}>{title}</h3>
        <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:8,padding:6,cursor:"pointer"}}><Ico n="x" s={15} c={C.mute}/></button>
      </div>
      {ch}
    </div>
  </div>
);

const HR=({text})=>(
  <div style={{display:"flex",alignItems:"center",gap:8,margin:"14px 0 10px"}}>
    <div style={{flex:1,height:1,background:C.border}}/>
    {text&&<span style={{fontSize:10,fontWeight:700,color:C.faint,letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{text}</span>}
    <div style={{flex:1,height:1,background:C.border}}/>
  </div>
);

const HDR=({ic,title,sub,action})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
    <div style={{display:"flex",gap:9,alignItems:"center"}}>
      <div style={{background:"linear-gradient(135deg,#1B3A7A,#C8973F)",borderRadius:9,padding:7,display:"flex"}}><Ico n={ic} s={17} c="#fff"/></div>
      <div>
        <div style={{fontWeight:700,fontSize:16,color:C.ink}}>{title}</div>
        {sub&&<div style={{fontSize:11,color:C.mute,marginTop:1}}>{sub}</div>}
      </div>
    </div>
    {action}
  </div>
);

const StatBox=({val,label,color,icon})=>(
  <div style={{background:C.white,borderRadius:12,padding:"13px 8px",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
    {icon&&<div style={{fontSize:18,marginBottom:3}}>{icon}</div>}
    <div style={{fontSize:20,fontWeight:900,color:color||"#1B3A7A"}}>{val}</div>
    <div style={{fontSize:10,color:C.mute,marginTop:2,lineHeight:1.3}}>{label}</div>
  </div>
);

const Toast=({msg,ok=true})=>(
  <div className="in" style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",background:ok?"#1B3A7A":C.rose,color:"#fff",padding:"9px 18px",borderRadius:30,fontSize:12,fontWeight:700,zIndex:300,boxShadow:"0 4px 18px rgba(0,0,0,.18)",whiteSpace:"nowrap"}}>{ok?"✓ ":"✕ "}{msg}</div>
);

/* LINE logo */
const LLogo=({s=22,c="#fff"})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

/* ════════════════════════════════════════════════════════════
   PART 1 — ระบบแนะนำรับสมัครนักศึกษา
════════════════════════════════════════════════════════════ */

/* ── 1. ข้อมูลแนะนำสถาบัน (1.1–1.6) + ปุ่มหลัก ── */
const Screen_Institution=({goAdvisor,toast})=>{
  const [trackModal,setTrackModal]=useState(false);
  const [trackId,setTrackId]=useState("");
  const [uploadModal,setUploadModal]=useState(false);
  const [uploadFile,setUploadFile]=useState("");
  const [applyModal,setApplyModal]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",interest:FACULTIES[0].branches[0].name});

  return(
    <div className="up">
      <HDR ic="build" title="แนะนำสถาบัน" sub="มหาวิทยาลัยนวัตกรรมไทย (MIT)"/>

      {/* Hero banner */}
      <div style={{background:"linear-gradient(145deg,#0D1E42 0%,#1B3A7A 70%,#1A5FAD 100%)",borderRadius:16,padding:"22px 18px",color:"#fff",marginBottom:12,overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:"#C8973F18"}}/>
        <div style={{position:"absolute",right:20,bottom:-30,width:80,height:80,borderRadius:"50%",background:"#C8973F10"}}/>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
          <div style={{background:"#fff",borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontWeight:900,fontSize:14,color:"#1a2a4a"}}>SAU</span>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:16,lineHeight:1.2}}>มหาวิทยาลัยเอเชียอาคเนย์</div>
            <div style={{fontSize:11,opacity:.7}}>Southeast Asia University (SAU)</div>
          </div>
        </div>
        <div style={{color:"rgba(255,255,255,.65)",fontSize:12,marginBottom:14,lineHeight:1.7}}>
          ก่อตั้ง พ.ศ. 2516 · รับรองโดย สกอ. · เลขที่ 19/1 ถ.เพชรเกษม เขตหนองแขม กทม. 10160
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
          {[["50+","ปีแห่งความเป็นเลิศ"],["10+","หลักสูตร"],["รับรอง","สกอ./ก.พ."],["Hybrid","Learning"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,.09)",borderRadius:9,padding:"9px 4px",textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:13,color:"#C8973F"}}>{v}</div>
              <div style={{fontSize:8,opacity:.68,marginTop:2,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5 ปุ่มหลัก ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Btn ic="edit" ch="สนใจสมัคร" onClick={()=>setApplyModal(true)} full/>
        <Btn ic="chat" ch="ปรึกษาอาจารย์" v="dark" onClick={goAdvisor} full/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        <Btn ic="upload" ch="อัปโหลดเอกสาร" v="sec" sz="sm" onClick={()=>setUploadModal(true)} full/>
        <Btn ic="download" ch="ดาวน์โหลด" v="sec" sz="sm" onClick={()=>toast("ดาวน์โหลดแคตตาล็อก MIT 2568 แล้ว")} full/>
        <Btn ic="track" ch="ติดตามสถานะ" v="sec" sz="sm" onClick={()=>setTrackModal(true)} full/>
      </div>

      {/* 1.1–1.4 ข้อมูลสถาบัน */}
      <HR text="ข้อมูลสถาบัน SAU"/>
      {[
        {e:"🏛️",t:"ประวัติมหาวิทยาลัย",d:"ก่อตั้ง พ.ศ. 2516 เลขที่ 19/1 ถ.เพชรเกษม เขตหนองแขม กรุงเทพฯ 10160 โทร: 02-807-4500 เปิดทำการ: อังคาร–อาทิตย์ 08:30–16:30 น."},
        {e:"🎯",t:"วิสัยทัศน์",d:"มุ่งผลิตบัณฑิตที่มีคุณภาพ คุณธรรม มีทักษะวิชาชีพที่ทันสมัย พร้อมรับใช้สังคมและประเทศชาติ"},
        {e:"🌟",t:"จุดเด่นของ SAU",d:"✓ Hybrid Learning (Online + Classroom) ✓ Block Course ไม่กระทบเวลาทำงาน ✓ เทียบโอนหน่วยกิตได้ ✓ ค่าเทอมผ่อนชำระเป็นภาคการศึกษา"},
        {e:"✅",t:"การรับรองหลักสูตร",d:"รับรองโดย อว. (สกอ.) · ก.พ. · คุรุสภา · เนติบัณฑิตยสภา · สำนักงาน ก.พ. รับรองปริญญาทุกหลักสูตร"},
      ].map(i=>(
        <Card key={i.t} style={{padding:13}} ch={
          <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
            <span style={{fontSize:20}}>{i.e}</span>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:C.ink,marginBottom:2}}>{i.t}</div>
              <div style={{fontSize:12,color:C.mute,lineHeight:1.65}}>{i.d}</div>
            </div>
          </div>
        }/>
      ))}

      {/* 1.5 ภาพบรรยากาศ */}
      <HR text="1.5 ภาพบรรยากาศ SAU"/>

      {/* Hero image — อาคารหลัก */}
      <div style={{borderRadius:14,overflow:"hidden",marginBottom:8,position:"relative"}}>
        <img
          src="https://www.sau.ac.th/wp-content/uploads/2022/01/sau-building.jpg"
          alt="อาคารมหาวิทยาลัยเอเชียอาคเนย์"
          onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
          style={{width:"100%",height:180,objectFit:"cover",display:"block"}}
        />
        <div style={{display:"none",width:"100%",height:180,background:"linear-gradient(135deg,#0D1E42,#1B3A7A)",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
          <span style={{fontSize:36}}>🏛️</span>
          <span style={{color:"#C8973F",fontWeight:700,fontSize:13}}>มหาวิทยาลัยเอเชียอาคเนย์</span>
          <span style={{color:"rgba(255,255,255,.6)",fontSize:11}}>Southeast Asia University</span>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(13,30,66,0.85))",padding:"20px 14px 10px"}}>
          <div style={{color:"#fff",fontWeight:700,fontSize:13}}>มหาวิทยาลัยเอเชียอาคเนย์ (SAU)</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:11}}>19/1 ถ.เพชรเกษม เขตหนองแขม กรุงเทพฯ</div>
        </div>
      </div>

      {/* Gallery grid 2×2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:8}}>
        {[
          {url:"https://www.sau.ac.th/wp-content/uploads/2021/09/SAU-campus.jpg", fb:"🏢", label:"อาคารสำนักอธิการบดี"},
          {url:"https://www.sau.ac.th/wp-content/uploads/2021/09/sau-library.jpg", fb:"📚", label:"ห้องสมุด SAU"},
          {url:"https://www.sau.ac.th/wp-content/uploads/2021/09/sau-classroom.jpg", fb:"🎓", label:"ห้องเรียน Hybrid"},
          {url:"https://www.sau.ac.th/wp-content/uploads/2021/09/sau-garden.jpg", fb:"🌳", label:"บรรยากาศภายใน"},
        ].map(img=>(
          <div key={img.label} style={{borderRadius:10,overflow:"hidden",position:"relative",height:110}}>
            <img
              src={img.url}
              alt={img.label}
              onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
            />
            <div style={{display:"none",width:"100%",height:"100%",background:"linear-gradient(135deg,#1B3A7A20,#C8973F20)",border:`1px solid #D4DCF0`,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
              <span style={{fontSize:26}}>{img.fb}</span>
              <span style={{fontSize:9,color:C.mute,fontWeight:600,textAlign:"center",padding:"0 6px"}}>{img.label}</span>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(13,30,66,0.75))",padding:"12px 8px 6px"}}>
              <div style={{color:"#fff",fontSize:10,fontWeight:600}}>{img.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3 — กิจกรรม */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:4}}>
        {[
          {url:"https://www.sau.ac.th/wp-content/uploads/2022/06/waikru.jpg", fb:"🙏", label:"พิธีไหว้ครู"},
          {url:"https://www.sau.ac.th/wp-content/uploads/2022/07/graduation.jpg", fb:"🎓", label:"พิธีรับปริญญา"},
          {url:"https://www.sau.ac.th/wp-content/uploads/2022/05/sports.jpg", fb:"🏆", label:"กีฬา SAU"},
        ].map(img=>(
          <div key={img.label} style={{borderRadius:10,overflow:"hidden",position:"relative",height:80}}>
            <img
              src={img.url}
              alt={img.label}
              onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
            />
            <div style={{display:"none",width:"100%",height:"100%",background:`linear-gradient(135deg,${C.gl},#e8f0ff)`,border:`1px solid ${C.border}`,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:3}}>
              <span style={{fontSize:20}}>{img.fb}</span>
              <span style={{fontSize:8,color:C.mute,fontWeight:600,textAlign:"center"}}>{img.label}</span>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(13,30,66,0.8))",padding:"8px 6px 4px"}}>
              <div style={{color:"#fff",fontSize:9,fontWeight:600}}>{img.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ป้ายชื่อมหาวิทยาลัย real photo */}
      <div style={{borderRadius:12,overflow:"hidden",marginBottom:4,position:"relative",height:100}}>
        <img
          src="https://lh3.googleusercontent.com/p/AF1QipN5KUt7XDmyAWVbLnw_-RCxNxP3HMHmLqnz2Ykk=s1360-w1360-h1020"
          alt="ป้ายมหาวิทยาลัยเอเชียอาคเนย์"
          onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%",display:"block"}}
        />
        <div style={{display:"none",width:"100%",height:"100%",background:"linear-gradient(135deg,#0D1E42,#1B3A7A)",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontSize:28}}>🏫</span>
          <div>
            <div style={{color:"#C8973F",fontWeight:700,fontSize:12}}>มหาวิทยาลัยเอเชียอาคเนย์</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:10}}>South-East Asia University · ก่อตั้ง พ.ศ. 2516</div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(13,30,66,0.85))",padding:"16px 12px 8px"}}>
          <div style={{color:"#C8973F",fontWeight:700,fontSize:12}}>South-East Asia University · ก่อตั้ง พ.ศ. 2516</div>
        </div>
      </div>

      {/* 1.6 วิดีโอแนะนำ */}
      <HR text="1.6 วิดีโอแนะนำ"/>
      <Card style={{padding:0,overflow:"hidden"}} ch={
        <div style={{borderRadius:14,overflow:"hidden"}}>
          {/* YouTube embed */}
          <div style={{position:"relative",paddingBottom:"56.25%",height:0,background:"#000"}}>
            <iframe
              src="https://www.youtube.com/embed/pXwsQu0q9aE?si=jiKnVq9O5T7HLr-F"
              title="แนะนำมหาวิทยาลัยเอเชียอาคเนย์ SAU"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
            />
          </div>
          <div style={{padding:"12px 14px",background:"#0D1E42",display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:"#fff"}}>แนะนำมหาวิทยาลัยเอเชียอาคเนย์</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:2}}>Southeast Asia University (SAU)</div>
            </div>
            <a href="https://youtu.be/pXwsQu0q9aE" target="_blank" rel="noopener noreferrer"
              style={{background:C.rose,color:"#fff",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,textDecoration:"none",flexShrink:0}}>
              ▶ YouTube
            </a>
          </div>
        </div>
      }/>

      {/* อาชีพหลังสำเร็จการศึกษา */}
      <HR text="อาชีพหลังสำเร็จการศึกษา"/>
      <Card style={{padding:13}} ch={
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:C.ink}}>🎯 หลักสูตรของ SAU เปิดประตูสู่...</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["ทนายความ","อัยการ","ผู้พิพากษา","นิติกร","ราชการ","ตำรวจ/ทหาร","ปลัดอำเภอ","ผู้บริหารองค์กร","นักการทูต","ครู/อาจารย์","นักวิจัย","ผู้ประกอบการ"].map(c=>(
              <div key={c} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 9px",fontSize:11,fontWeight:600,color:C.text}}>{c}</div>
            ))}
          </div>
        </div>
      }/>

      {/* MODALS */}
      {applyModal&&(
        <Modal title="📝 สมัครเรียน" onClose={()=>setApplyModal(false)} ch={
          <div>
            <Inp label="ชื่อ-นามสกุล *" val={form.name} set={v=>setForm({...form,name:v})} ph="ชื่อของคุณ"/>
            <Inp label="เบอร์โทรศัพท์ *" val={form.phone} set={v=>setForm({...form,phone:v})} ph="08X-XXX-XXXX" type="tel"/>
            <Inp label="อีเมล" val={form.email} set={v=>setForm({...form,email:v})} ph="email@example.com" type="email"/>
            <Sel label="สาขาที่สนใจ" val={form.interest} set={v=>setForm({...form,interest:v})} opts={FACULTIES.flatMap(f=>f.branches.map(b=>b.name))}/>
            <Btn ch="ส่งข้อมูลสมัคร" onClick={()=>{if(!form.name||!form.phone){toast("กรุณากรอกชื่อและเบอร์โทร",false);return;}setApplyModal(false);toast("ส่งข้อมูลสมัครแล้ว! อาจารย์จะติดต่อกลับภายใน 24 ชม.");}} dis={!form.name||!form.phone} ic="send" full/>
          </div>
        }/>
      )}

      {uploadModal&&(
        <Modal title="📤 อัปโหลดเอกสาร" onClose={()=>setUploadModal(false)} ch={
          <div>
            <div style={{background:C.gll,border:`2px dashed #1B3A7A`,borderRadius:12,padding:"24px",textAlign:"center",marginBottom:12,cursor:"pointer"}} onClick={()=>setUploadFile("document.pdf")}>
              <Ico n="upload" s={28} c="#1B3A7A"/>
              <div style={{fontWeight:700,marginTop:8,color:C.ink}}>{uploadFile||"คลิกหรือลากไฟล์มาวางที่นี่"}</div>
              <div style={{fontSize:11,color:C.mute,marginTop:4}}>รองรับ PDF, JPG, PNG (สูงสุด 10 MB)</div>
            </div>
            {["📄 Transcript","📋 Resume / CV","💼 Portfolio","🪪 สำเนาบัตรประชาชน"].map(d=>(
              <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                <span>{d}</span>
                <Btn ch="เลือก" v="sec" sz="sm" onClick={()=>setUploadFile(d)}/>
              </div>
            ))}
            <Btn ch="อัปโหลด" ic="upload" onClick={()=>{setUploadModal(false);toast("อัปโหลดเอกสารสำเร็จ!");}} dis={!uploadFile} full style={{marginTop:12}}/>
          </div>
        }/>
      )}

      {trackModal&&(
        <Modal title="🔍 ติดตามสถานะการสมัคร" onClose={()=>setTrackModal(false)} ch={
          <div>
            <Inp label="รหัสติดตาม หรือ เบอร์โทร" val={trackId} set={setTrackId} ph="เช่น P001 หรือ 089-111-2222"/>
            <Btn ch="ค้นหาสถานะ" ic="search" onClick={()=>toast(`สถานะ: "ส่งเอกสารแล้ว" — อาจารย์กำลังตรวจสอบ`)} full/>
            <HR text="Pipeline สถานะ"/>
            <div style={{display:"flex",gap:0,marginTop:4}}>
              {["สนใจ","ส่งเอกสาร","รอตรวจ","สัมภาษณ์","สำเร็จ"].map((s,i)=>(
                <div key={s} style={{flex:1,background:i<=1?"#1B3A7A":C.border,borderRadius:i===0?"8px 0 0 8px":i===4?"0 8px 8px 0":0,padding:"8px 3px",textAlign:"center"}}>
                  <div style={{fontSize:8,fontWeight:700,color:i<=1?"#fff":C.faint,lineHeight:1.3}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        }/>
      )}
    </div>
  );
};

/* ── 2. คณะและสาขา ── */
const Screen_Faculty=({toast})=>{
  const [sel,setSel]=useState(null);
  const [q,setQ]=useState("");
  const filtered=FACULTIES.filter(f=>!q||f.name.includes(q)||f.branches.some(b=>b.name.includes(q)));
  return(
    <div className="up">
      <HDR ic="book" title="คณะและสาขาวิชา" sub={`${FACULTIES.length} คณะ · ${FACULTIES.flatMap(f=>f.branches).length} สาขา`}/>
      <div style={{position:"relative",marginBottom:10}}>
        <div style={{position:"absolute",left:10,top:10}}><Ico n="search" s={15} c={C.faint}/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ค้นหาคณะหรือสาขา..." style={{width:"100%",padding:"10px 12px 10px 30px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13,outline:"none"}}/>
      </div>
      {filtered.map(f=>(
        <Card key={f.id} style={{border:`1.5px solid ${sel===f.id?(f.color||"#1B3A7A"):"transparent"}`,padding:13,cursor:"pointer"}} onClick={()=>setSel(sel===f.id?null:f.id)} ch={
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:38,height:38,background:`${f.color}14`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{f.em}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:C.ink}}>{f.name}</div>
                  <div style={{fontSize:11,color:C.mute}}>{f.branches.length} สาขา</div>
                </div>
              </div>
              <span style={{color:sel===f.id?f.color:C.faint}}>{sel===f.id?"▲":"▼"}</span>
            </div>
            {sel===f.id&&(
              <div className="in" style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
                {f.branches.map(b=>(
                  <div key={b.name} style={{background:C.bg,borderRadius:9,padding:11,marginBottom:7}}>
                    {/* 2.2 สาขา */}
                    <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{b.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:5}}>
                      {/* 2.3 หลักสูตร / 2.4 ระยะเวลา / 2.5 รูปแบบ */}
                      <Chip text={`${b.yrs} ปี`} type="info" sm/>
                      <Chip text={b.mode} sm/>
                      {b.feeTotal && <Chip text={b.feeTotal} type="warn" sm/>}
                    </div>
                    {b.note && <div style={{fontSize:11,color:C.mute,marginBottom:6,lineHeight:1.5}}>📋 {b.note}</div>}
                    {b.careers && <div style={{fontSize:11,color:C.teal,marginBottom:8}}>💼 {b.careers.slice(0,3).join(" | ")}</div>}
                    <Btn ch="สนใจสมัครหลักสูตรนี้" sz="sm" ic="edit" onClick={()=>toast(`สมัคร "${b.name}" แล้ว! รอติดต่อกลับ`)}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        }/>
      ))}
    </div>
  );
};

/* ── 3. เทียบโอน ── */
const Screen_Transfer=({toast})=>{
  const [files,setFiles]=useState({});
  const [exp,setExp]=useState({co:"",role:"",yrs:"",desc:""});
  const [done,setDone]=useState(false);

  if(done) return(
    <div className="up">
      <HDR ic="swap" title="ส่งเอกสารแล้ว"/>
      <Card style={{background:"linear-gradient(135deg,#0D1E42,#1B3A7A)",color:"#fff",textAlign:"center",padding:28}} ch={
        <div>
          <div style={{fontSize:46}}>✅</div>
          <div style={{fontWeight:800,fontSize:17,marginTop:10}}>ส่งเอกสารสำเร็จ!</div>
          <div style={{fontSize:12,opacity:.85,marginTop:7,lineHeight:1.7}}>อาจารย์จะตรวจสอบและแจ้งผลผ่าน LINE ภายใน 7–14 วันทำการ</div>
        </div>
      }/>
      <Card style={{marginTop:6}} ch={
        <div>
          <div style={{fontWeight:700,marginBottom:10}}>📊 ประมาณการเบื้องต้น</div>
          {[["หน่วยกิตที่เทียบได้","~18 หน่วยกิต"],["ระยะเวลาเรียนที่เหลือ","~2.5 ปี"],["ค่าเรียนที่ประหยัดได้","~฿54,000"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
              <span style={{color:C.mute}}>{l}</span><span style={{fontWeight:700,color:"#1B3A7A"}}>{v}</span>
            </div>
          ))}
        </div>
      }/>
      <Btn ch="ส่งใหม่" v="sec" onClick={()=>{setDone(false);setFiles({});setExp({co:"",role:"",yrs:"",desc:""}); }} full style={{marginTop:6}}/>
    </div>
  );

  return(
    <div className="up">
      <HDR ic="swap" title="เทียบโอน / ประสบการณ์" sub="ดึงดูดวัยทำงาน — ลดเวลาและค่าใช้จ่าย"/>
      <Card style={{background:C.gl,border:"1px solid #1B3A7A22",padding:13}} ch={
        <div>
          <div style={{fontWeight:700,color:C.gd,marginBottom:7}}>✅ คุณสมบัติผู้มีสิทธิ์เทียบโอน</div>
          {["ผลการเรียน ≥ C (2.00) ในวิชาที่ขอเทียบ","เนื้อหาตรงกัน ≥ 75%","ประสบการณ์ทำงาน ≥ 1 ปี ในสาขาที่เกี่ยวข้อง"].map(t=>(
            <div key={t} style={{fontSize:12,color:C.gd,marginBottom:3,display:"flex",gap:6}}>✓ {t}</div>
          ))}
        </div>
      }/>

      <HR text="อัปโหลดเอกสาร"/>
      {[{k:"transcript",l:"📄 Transcript",req:true},{k:"resume",l:"📋 Resume / CV"},{k:"portfolio",l:"💼 Portfolio"}].map(d=>(
        <Card key={d.k} style={{padding:12}} ch={
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>{d.l}{d.req&&<span style={{color:C.rose}}> *</span>}</div>
              {files[d.k]&&<div style={{fontSize:11,color:"#1B3A7A",marginTop:2}}>✓ อัปโหลดแล้ว</div>}
            </div>
            <Btn ch={files[d.k]?"เปลี่ยน":"อัปโหลด"} v="sec" sz="sm" ic="upload" onClick={()=>setFiles({...files,[d.k]:true})}/>
          </div>
        }/>
      ))}

      <HR text="แบบฟอร์มประสบการณ์ทำงาน"/>
      <Card ch={
        <div>
          <Inp label="บริษัท/หน่วยงาน" val={exp.co} set={v=>setExp({...exp,co:v})} ph="ชื่อบริษัท"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Inp label="ตำแหน่ง" val={exp.role} set={v=>setExp({...exp,role:v})} ph="เช่น Programmer"/>
            <Inp label="ปีที่ทำงาน" val={exp.yrs} set={v=>setExp({...exp,yrs:v})} ph="ปี" type="number"/>
          </div>
          <Inp label="รายละเอียดงาน" val={exp.desc} set={v=>setExp({...exp,desc:v})} ph="อธิบายสั้นๆ..." rows={3}/>
        </div>
      }/>

      <Card style={{background:C.ink,color:"#fff"}} ch={
        <div>
          <div style={{fontWeight:700,color:"#C8973F",marginBottom:9}}>🧮 ประมาณการค่าใช้จ่ายหลังเทียบโอน</div>
          {[["ค่าเรียนปกติ 4 ปี","฿160,000"],["ลดจากการเทียบโอน","- ฿54,000"],["คาดว่าจ่ายจริง","฿106,000"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.1)",fontSize:13}}>
              <span style={{color:"rgba(255,255,255,.65)"}}>{l}</span>
              <span style={{fontWeight:700,color:v.includes("-")?"#C8973F":"#fff"}}>{v}</span>
            </div>
          ))}
        </div>
      }/>
      <Btn ch="ส่งเอกสารเพื่อตรวจสอบ" ic="send" onClick={()=>{if(!files.transcript){toast("กรุณาอัปโหลด Transcript ก่อน",false);return;}setDone(true);toast("ส่งเอกสารสำเร็จ!");}} dis={!files.transcript} full style={{marginTop:6}}/>
    </div>
  );
};

/* ── 4. ค่าใช้จ่าย ── */
const Screen_Tuition=()=>{
  const [fid,setFid]=useState("law");
  const [sems,setSems]=useState(8);
  const fac=FACULTIES.find(f=>f.id===fid)||FACULTIES[0];
  const feeNum=fac.branches[0].fee||0;
  return(
    <div className="up">
      <HDR ic="wallet" title="ค่าใช้จ่ายและทุน" sub="โปร่งใส คำนวณได้ทันที"/>
      <Card style={{background:"linear-gradient(135deg,#0D1E42,#1B3A7A)",color:"#fff"}} ch={
        <div>
          <div style={{fontWeight:700,color:"#C8973F",marginBottom:9}}>🧮 เครื่องคำนวณค่าใช้จ่าย</div>
          <Sel label="" val={fid} set={setFid} opts={FACULTIES.map(f=>({v:f.id,l:`${f.em} ${f.name}`}))}/>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:4}}>จำนวนภาคเรียน: {sems}</div>
            <input type="range" min="2" max="8" value={sems} onChange={e=>setSems(+e.target.value)} style={{width:"100%",accentColor:"#1B3A7A"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {[["ค่าเรียนรวม",fac.branches[0].feeTotal||"ดูตามหลักสูตร","#1B3A7A"],["งวด กยศ./เดือน","ผ่อนชำระตามภาค",C.amber]].map(([l,v,c])=>(
              <div key={l} style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:11,textAlign:"center"}}>
                <div style={{fontSize:19,fontWeight:900,color:c}}>{v}</div>
                <div style={{fontSize:9,opacity:.6,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      }/>
      <HR text="ค่าเทอมแต่ละคณะ"/>
      {FACULTIES.map(f=>(
        <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.white,borderRadius:9,marginBottom:6,border:`1px solid ${C.border}`}}>
          <span style={{fontSize:13}}>{f.em} {f.name}</span>
          <Chip text={`฿${Math.min(...f.branches.map(b=>b.fee)).toLocaleString()}/เทอม`} type="info" sm/>
        </div>
      ))}
      <HR text="แหล่งเงินทุน"/>
      {[
        {t:"🏦 กยศ. – กองทุนเงินให้กู้ยืม",c:"#DBEAFE",tc:"#1E40AF",items:["กู้ค่าเล่าเรียนเต็มจำนวน","ค่าครองชีพ 2,500 บ./เดือน","ดอกเบี้ย 1% ต่อปี","เริ่มชำระ 2 ปีหลังจบ · studentloan.or.th"]},
        {t:"🎓 ทุนการศึกษามหาวิทยาลัย",c:"#F0FDF4",tc:"#166534",items:["ทุนเรียนดี GPA ≥ 3.5 (ยกเว้น 50%)","ทุนผู้มีรายได้น้อย (ยกเว้น 75%)","ทุนกีฬา / กิจกรรม / ความสามารถพิเศษ"]},
      ].map(s=>(
        <Card key={s.t} style={{background:s.c,padding:13}} ch={
          <div>
            <div style={{fontWeight:700,fontSize:13,color:s.tc,marginBottom:7}}>{s.t}</div>
            {s.items.map(i=><div key={i} style={{fontSize:12,color:s.tc,marginBottom:3}}>• {i}</div>)}
          </div>
        }/>
      ))}
    </div>
  );
};

/* ── อาจารย์ที่ปรึกษา (ก่อนสมัคร) ── */
const Screen_AdvisorPre=({toast})=>{
  const [sel,setSel]=useState(null);
  const [appt,setAppt]=useState({date:"",time:"",topic:""});
  const [booked,setBooked]=useState(false);
  return(
    <div className="up">
      <HDR ic="chat" title="ปรึกษาอาจารย์" sub='"จุดขาย" — ดูแล 1 ต่อ 1 ผ่าน LINE'/>
      <Card style={{background:"linear-gradient(135deg,#C8973F,#A07230)",color:"#fff",padding:14}} ch={
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>🌟 ทำไมต้องมีอาจารย์ที่ปรึกษา?</div>
          <div style={{fontSize:12,opacity:.88,lineHeight:1.7}}>ทุกคนได้รับอาจารย์ดูแล 1 ต่อ 1 ตั้งแต่วันแรกที่สนใจ ช่วยวางแผนการเรียน เทียบโอน จนถึงสมัครสำเร็จ</div>
        </div>
      }/>
      <HR text="เลือกอาจารย์ที่ปรึกษา"/>
      {ADVISORS.map((a,i)=>(
        <Card key={a.name} style={{border:`1.5px solid ${sel===i?"#1B3A7A":"transparent"}`,padding:13}}>
          <div style={{display:"flex",gap:11,alignItems:"center",cursor:"pointer"}} onClick={()=>setSel(sel===i?null:i)}>
            <div style={{width:44,height:44,background:C.gll,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👨‍🏫</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13}}>{a.name}</div>
              <div style={{fontSize:11,color:C.mute}}>{a.dept} · {a.avail}</div>
            </div>
            <Chip text="ว่าง" type="ok"/>
          </div>
          {sel===i&&(
            <div className="in" style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
              {booked?(
                <div style={{textAlign:"center",padding:12}}>
                  <div style={{fontSize:36}}>✅</div>
                  <div style={{fontWeight:700,marginTop:8}}>นัดหมายสำเร็จ!</div>
                  <div style={{fontSize:12,color:C.mute,marginTop:4}}>{appt.date} เวลา {appt.time}</div>
                  <Btn ch="นัดใหม่" v="sec" sz="sm" onClick={()=>setBooked(false)} style={{margin:"8px auto"}}/>
                </div>
              ):(
                <>
                  <Inp label="วันที่" val={appt.date} set={v=>setAppt({...appt,date:v})} type="date"/>
                  <Sel label="เวลา" val={appt.time} set={v=>setAppt({...appt,time:v})} opts={a.slots}/>
                  <Inp label="หัวข้อที่ต้องการปรึกษา" val={appt.topic} set={v=>setAppt({...appt,topic:v})} ph="เช่น สมัครเรียน, เทียบโอน"/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Btn ch="นัดหมาย" ic="star" sz="sm" onClick={()=>{setBooked(true);toast("นัดหมายสำเร็จ!");}}/>
                    <Btn ch="แชท LINE" ic="chat" v="sec" sz="sm" onClick={()=>toast(`เปิด LINE: ${a.line}`)}/>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   PART 2 — ระบบฐานข้อมูลนักศึกษา
════════════════════════════════════════════════════════════ */

/* ── 2.1 Admin จัดการนักศึกษา ── */
const Screen_Admin=({students,setStudents,toast})=>{
  const [q,setQ]=useState("");
  const [edit,setEdit]=useState(null);
  const [addNew,setAddNew]=useState(false);
  const filtered=students.filter(s=>s.name.includes(q)||s.id.includes(q)||s.faculty.includes(q));

  const StuForm=({init,onSave,onClose})=>{
    const [f,setF]=useState({...init});
    return(
      <Modal title={students.find(s=>s.id===init.id&&init.id)?"แก้ไขข้อมูล":"เพิ่มนักศึกษาใหม่"} onClose={onClose} ch={
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Inp label="รหัส *" val={f.id} set={v=>setF({...f,id:v})} ph="STU00X"/>
            <Inp label="ชื่อ-นามสกุล *" val={f.name} set={v=>setF({...f,name:v})}/>
            <Inp label="เบอร์โทร" val={f.phone} set={v=>setF({...f,phone:v})} type="tel"/>
            <Inp label="อีเมล" val={f.email} set={v=>setF({...f,email:v})} type="email"/>
            <Inp label="LINE ID" val={f.lineId} set={v=>setF({...f,lineId:v})}/>
            <Inp label="GPA" val={f.gpa} set={v=>setF({...f,gpa:parseFloat(v)||0})} type="number"/>
            <Inp label="ชั้นปี" val={f.yr} set={v=>setF({...f,yr:parseInt(v)||1})} type="number"/>
            <Inp label="% เข้าเรียน" val={f.attend} set={v=>setF({...f,attend:parseInt(v)||0})} type="number"/>
          </div>
          <Sel label="คณะ" val={f.faculty} set={v=>setF({...f,faculty:v})} opts={FACULTIES.map(x=>x.name)}/>
          <Sel label="อาจารย์ที่ปรึกษา" val={f.advisor} set={v=>setF({...f,advisor:v})} opts={ADVISORS.map(a=>a.name)}/>
          <Sel label="สถานะ" val={f.status} set={v=>setF({...f,status:v})} opts={["กำลังศึกษา","พักการศึกษา","ลาออก","สำเร็จการศึกษา"]}/>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            <label style={{display:"flex",gap:6,alignItems:"center",fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={f.paid} onChange={e=>setF({...f,paid:e.target.checked})}/>ชำระค่าเทอมแล้ว</label>
            <label style={{display:"flex",gap:6,alignItems:"center",fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={f.pdpa} onChange={e=>setF({...f,pdpa:e.target.checked})}/>ยินยอม PDPA</label>
          </div>
          <Btn ch="บันทึก" ic="check" onClick={()=>onSave(f)} dis={!f.id||!f.name} full/>
        </div>
      }/>
    );
  };

  const save=(f)=>{
    if(students.find(s=>s.id===f.id)){
      setStudents(students.map(s=>s.id===f.id?{...f}:s));
      toast("บันทึกข้อมูลแล้ว");
    }else{
      setStudents([...students,{...f,docs:[],notes:[],slip:null}]);
      toast("เพิ่มนักศึกษาใหม่แล้ว");
    }
    setEdit(null);setAddNew(false);
  };

  return(
    <div className="up">
      <HDR ic="users" title="จัดการนักศึกษา (Admin)" sub={`${students.length} คนทั้งหมด`}
        action={<Btn ic="plus" ch="เพิ่ม" sz="sm" onClick={()=>setAddNew(true)}/>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
        <StatBox val={students.length} label="ทั้งหมด" color={C.sky}/>
        <StatBox val={students.filter(s=>s.paid).length} label="ชำระแล้ว" color="#1B3A7A"/>
        <StatBox val={students.filter(s=>!s.paid).length} label="ค้างชำระ" color={C.rose}/>
        <StatBox val={(students.reduce((a,s)=>a+s.gpa,0)/students.length).toFixed(2)} label="GPA เฉลี่ย" color={C.violet}/>
      </div>
      <div style={{position:"relative",marginBottom:10}}>
        <div style={{position:"absolute",left:10,top:10}}><Ico n="search" s={15} c={C.faint}/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ค้นหาชื่อ, รหัส, คณะ..." style={{width:"100%",padding:"10px 12px 10px 30px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13,outline:"none"}}/>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:10}}>
        <Btn ic="download" ch="Excel" v="sec" sz="sm" onClick={()=>toast("Export Excel แล้ว")}/>
        <Btn ic="file" ch="PDF" v="sec" sz="sm" onClick={()=>toast("Export PDF แล้ว")}/>
      </div>
      {filtered.map(s=>(
        <Card key={s.id} style={{padding:13}} accent={!s.paid||s.gpa<2.5?C.rose:undefined} ch={
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
              <div style={{display:"flex",gap:9}}>
                <div style={{width:40,height:40,background:C.gll,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#1B3A7A"}}>{s.name.charAt(0)}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:C.ink}}>{s.name}</div>
                  <div style={{fontSize:11,color:C.mute}}>{s.id} · ชั้นปี {s.yr}</div>
                </div>
              </div>
              <Btn ic="edit" ch="แก้ไข" v="sec" sz="sm" onClick={()=>setEdit(s)}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              <Chip text={s.faculty} type="info" sm/>
              <Chip text={s.paid?"ชำระแล้ว":"ค้างชำระ"} type={s.paid?"ok":"bad"} sm/>
              <Chip text={`GPA ${s.gpa}`} sm/>
              <Chip text={`เข้า ${s.attend}%`} type={s.attend>=80?"ok":"warn"} sm/>
              {!s.pdpa&&<Chip text="⚠️ PDPA" type="warn" sm/>}
              {s.slip&&<Chip text="✓ สลิปแนบ" type="ok" sm/>}
            </div>
          </div>
        }/>
      ))}
      {edit&&<StuForm init={edit} onSave={save} onClose={()=>setEdit(null)}/>}
      {addNew&&<StuForm init={{id:`STU${String(students.length+1).padStart(3,"0")}`,name:"",faculty:FACULTIES[0].name,branch:FACULTIES[0].branches[0].name,yr:1,gpa:0,phone:"",email:"",lineId:"",paid:false,status:"กำลังศึกษา",advisor:ADVISORS[0].name,attend:80,pdpa:false,slip:null,docs:[],notes:[]}} onSave={save} onClose={()=>setAddNew(false)}/>}
    </div>
  );
};

/* ── 2.2 Student Portal (Login + ข้อมูลตัวเอง) ── */
const Screen_StudentPortal=({students,setStudents,toast})=>{
  const [step,setStep]=useState("login");
  const [cred,setCred]=useState({id:"",lineId:""});
  const [otp,setOtp]=useState("");
  const [err,setErr]=useState("");
  const [stu,setStu]=useState(null);
  const [tab,setTab]=useState("profile");
  const [editMode,setEditMode]=useState(false);
  const [ef,setEf]=useState({});
  const [slipModal,setSlipModal]=useState(false);
  const [docModal,setDocModal]=useState(false);
  const [pdpaModal,setPdpaModal]=useState(false);

  const login=()=>{
    const f=students.find(s=>s.id===cred.id&&s.lineId===cred.lineId);
    if(f){setStu(f);setStep("otp");setErr("");}
    else setErr("รหัสนักศึกษาหรือ LINE ID ไม่ถูกต้อง");
  };
  const verifyOtp=()=>{
    if(otp==="1234"){setStep("portal");if(!stu.pdpa)setPdpaModal(true);}
    else setErr("OTP ไม่ถูกต้อง (ทดลองใส่ 1234)");
  };
  const saveProfile=()=>{
    const u={...stu,...ef};
    setStudents(students.map(s=>s.id===stu.id?u:s));
    setStu(u);setEditMode(false);toast("อัปเดตข้อมูลแล้ว");
  };
  const uploadSlip=()=>{
    const u={...stu,slip:"slip_uploaded.jpg",paid:true};
    setStudents(students.map(s=>s.id===stu.id?u:s));
    setStu(u);setSlipModal(false);toast("แนบหลักฐานชำระเงินแล้ว!");
  };
  const addDoc=(name)=>{
    const u={...stu,docs:[...stu.docs,name]};
    setStudents(students.map(s=>s.id===stu.id?u:s));
    setStu(u);setDocModal(false);toast(`อัปโหลด "${name}" แล้ว`);
  };

  if(step==="login") return(
    <div className="up">
      <HDR ic="person" title="เข้าสู่ระบบนักศึกษา" sub="ยืนยันตัวตนผ่าน LINE OA"/>
      <Card style={{background:"linear-gradient(145deg,#0D1E42,#1B3A7A)",color:"#fff",textAlign:"center",padding:30}} ch={
        <div>
          <div style={{width:54,height:54,background:"#1B3A7A30",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><span style={{fontWeight:900,fontSize:16,color:"#C8973F"}}>SAU</span></div>
          <div style={{fontWeight:700,fontSize:17}}>Student Portal</div>
          <div style={{fontSize:11,opacity:.6,marginTop:5}}>ระบบข้อมูลนักศึกษา MIT</div>
        </div>
      }/>
      <Card style={{marginTop:8}} ch={
        <div>
          <Inp label="รหัสนักศึกษา" val={cred.id} set={v=>setCred({...cred,id:v})} ph="เช่น STU001"/>
          <Inp label="LINE ID" val={cred.lineId} set={v=>setCred({...cred,lineId:v})} ph="@lineid"/>
          {err&&<div style={{color:C.rose,fontSize:12,marginBottom:8}}>⚠️ {err}</div>}
          <Btn ch="ขอ OTP ผ่าน LINE" ic="lock" onClick={login} full/>
          <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.faint}}>💡 ทดลอง: STU001 / @somchai</div>
        </div>
      }/>
    </div>
  );

  if(step==="otp") return(
    <div className="up">
      <HDR ic="lock" title="ยืนยัน OTP"/>
      <Card style={{background:C.gl,border:"1px solid #1B3A7A30",textAlign:"center",padding:20}} ch={
        <div>
          <div style={{fontSize:32}}>📱</div>
          <div style={{fontWeight:700,marginTop:8}}>ส่ง OTP ไปยัง LINE ของคุณแล้ว</div>
          <div style={{fontSize:11,color:C.mute,marginTop:4}}>รหัส 4 หลัก · หมดอายุใน 5 นาที</div>
        </div>
      }/>
      <Card style={{marginTop:8}} ch={
        <div>
          <Inp label="กรอก OTP 4 หลัก" val={otp} set={setOtp} ph="XXXX"/>
          {err&&<div style={{color:C.rose,fontSize:12,marginBottom:8}}>⚠️ {err}</div>}
          <Btn ch="ยืนยัน OTP" ic="check" onClick={verifyOtp} full/>
          <div style={{textAlign:"center",marginTop:8,fontSize:11,color:C.faint}}>ทดลองใส่ 1234</div>
        </div>
      }/>
    </div>
  );

  /* ── Portal ── */
  const portalTabs=[
    {id:"profile",l:"โปรไฟล์",n:"person"},
    {id:"finance",l:"การเงิน",n:"wallet"},
    {id:"docs",l:"เอกสาร",n:"file"},
    {id:"advisor",l:"ปรึกษาอาจารย์",n:"chat"},
  ];

  return(
    <div className="up">
      {pdpaModal&&(
        <Modal title="📋 ยินยอม PDPA" onClose={()=>setPdpaModal(false)} ch={
          <div>
            <div style={{background:"#FDF3E3",borderRadius:9,padding:12,marginBottom:12,fontSize:12,color:"#7A4A10",lineHeight:1.7}}>⚠️ มหาวิทยาลัยนวัตกรรมไทยขอความยินยอมในการเก็บรวบรวมข้อมูลส่วนตัวของท่านตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562 เพื่อวัตถุประสงค์ด้านการศึกษา</div>
            <Btn ch="✓ ยินยอม" onClick={()=>{const u={...stu,pdpa:true};setStudents(students.map(s=>s.id===stu.id?u:s));setStu(u);setPdpaModal(false);toast("ยืนยัน PDPA แล้ว");}} full/>
          </div>
        }/>
      )}
      {slipModal&&(
        <Modal title="📤 อัปโหลดหลักฐานชำระเงิน" onClose={()=>setSlipModal(false)} ch={
          <div>
            <div style={{background:C.gll,border:`2px dashed #1B3A7A`,borderRadius:12,padding:"22px",textAlign:"center",marginBottom:12,cursor:"pointer"}} onClick={uploadSlip}>
              <Ico n="img" s={28} c="#1B3A7A"/>
              <div style={{fontWeight:700,marginTop:8,color:C.ink}}>คลิกเพื่อเลือกสลิปโอนเงิน</div>
              <div style={{fontSize:11,color:C.mute,marginTop:4}}>รองรับ JPG, PNG (ชัดเจน)</div>
            </div>
            <Btn ch="ยืนยันอัปโหลด" ic="upload" onClick={uploadSlip} full/>
          </div>
        }/>
      )}
      {docModal&&(
        <Modal title="📤 อัปโหลดเอกสาร" onClose={()=>setDocModal(false)} ch={
          <div>
            {["สำเนาบัตรประชาชน","สำเนาทะเบียนบ้าน","รูปถ่าย 1 นิ้ว","วุฒิการศึกษา","หลักฐานทางทหาร"].map(d=>(
              <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13}}>📄 {d}</span>
                <Btn ch="อัปโหลด" v="sec" sz="sm" ic="upload" onClick={()=>addDoc(d)}/>
              </div>
            ))}
          </div>
        }/>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <HDR ic="person" title={stu.name} sub={`${stu.id} · ${stu.faculty}`}/>
        <Btn ch="ออก" v="sec" sz="sm" onClick={()=>{setStep("login");setStu(null);setOtp("");setErr("");}}/>
      </div>

      {/* Tab bar */}
      <div style={{display:"flex",background:C.bg,borderRadius:11,padding:3,marginBottom:12,gap:3}}>
        {portalTabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 3px",border:"none",borderRadius:9,background:tab===t.id?C.white:"transparent",cursor:"pointer",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.07)":"none",fontFamily:"inherit"}}>
            <Ico n={t.n} s={15} c={tab===t.id?"#1B3A7A":C.faint}/>
            <span style={{fontSize:9,fontWeight:tab===t.id?700:500,color:tab===t.id?"#1B3A7A":C.faint,lineHeight:1.2,textAlign:"center"}}>{t.l}</span>
          </button>
        ))}
      </div>

      {/* ── โปรไฟล์ ── */}
      {tab==="profile"&&(
        <div className="in">
          <Card style={{background:`linear-gradient(145deg,${C.ink},#1c3450)`,color:"#fff"}} ch={
            <div>
              <div style={{display:"flex",gap:13,alignItems:"center",marginBottom:14}}>
                <div style={{width:52,height:52,background:"#1B3A7A",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800}}>{stu.name.charAt(0)}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>{stu.name}</div>
                  <div style={{color:"#C8973F",fontSize:12}}>{stu.id}</div>
                  <div style={{color:"rgba(255,255,255,.55)",fontSize:11}}>{stu.branch}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                {[["GPA",stu.gpa],["เข้าเรียน",`${stu.attend}%`],["ชั้นปี",stu.yr]].map(([l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,.09)",borderRadius:8,padding:"9px 4px",textAlign:"center"}}>
                    <div style={{fontWeight:800,fontSize:16,color:"#C8973F"}}>{v}</div>
                    <div style={{fontSize:9,opacity:.6,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          }/>

          {editMode?(
            <Card ch={
              <div>
                <Inp label="เบอร์โทร" val={ef.phone??stu.phone} set={v=>setEf({...ef,phone:v})}/>
                <Inp label="อีเมล" val={ef.email??stu.email} set={v=>setEf({...ef,email:v})} type="email"/>
                <Inp label="LINE ID" val={ef.lineId??stu.lineId} set={v=>setEf({...ef,lineId:v})}/>
                <div style={{display:"flex",gap:8}}>
                  <Btn ch="บันทึก" ic="check" onClick={saveProfile}/>
                  <Btn ch="ยกเลิก" v="sec" onClick={()=>setEditMode(false)}/>
                </div>
              </div>
            }/>
          ):(
            <Card ch={
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontWeight:700,fontSize:13}}>ข้อมูลส่วนตัว</div>
                  <Btn ic="edit" ch="แก้ไข" v="sec" sz="sm" onClick={()=>setEditMode(true)}/>
                </div>
                {[["📱","เบอร์โทร",stu.phone],["✉️","อีเมล",stu.email],["💬","LINE ID",stu.lineId],["👨‍🏫","อาจารย์ที่ปรึกษา",stu.advisor],["🔒","PDPA",stu.pdpa?"ยินยอมแล้ว ✅":"ยังไม่ยินยอม ⚠️"]].map(([e,l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                    <span style={{color:C.mute}}>{e} {l}</span>
                    <span style={{fontWeight:600,color:C.ink}}>{v}</span>
                  </div>
                ))}
              </div>
            }/>
          )}

          {/* ข้อมูลที่ Admin อัปเดต */}
          <Card style={{background:"#F0F4FF",border:`1px solid #C7D2FE`}} ch={
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#3730A3",marginBottom:8}}>📋 ข้อมูลที่ Admin อัปเดต</div>
              {[["สถานะ",stu.status],["คณะ",stu.faculty],["สาขา",stu.branch],["ชั้นปี",`ปีที่ ${stu.yr}`],["GPA",stu.gpa],["การเข้าเรียน",`${stu.attend}%`]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #C7D2FE30",fontSize:12}}>
                  <span style={{color:"#5B5FC7"}}>{l}</span>
                  <span style={{fontWeight:600,color:"#1E1B8B"}}>{v}</span>
                </div>
              ))}
            </div>
          }/>
        </div>
      )}

      {/* ── การเงิน ── */}
      {tab==="finance"&&(
        <div className="in">
          <Card style={{background:stu.paid?C.gl:"#FEF2F2",border:`1px solid ${stu.paid?"#1B3A7A":C.rose}30`,padding:14}} ch={
            <div>
              <div style={{fontWeight:700,color:stu.paid?"#122D63":C.rose,fontSize:15}}>{stu.paid?"✅ ชำระค่าเทอมแล้ว":"⚠️ ยังไม่ได้ชำระค่าเทอม"}</div>
              {!stu.paid&&<div style={{fontSize:12,color:C.rose,marginTop:4}}>กรุณาชำระและอัปโหลดสลิปภายใน 30 มิ.ย. 2568</div>}
              {stu.slip&&<div style={{fontSize:12,color:"#1B3A7A",marginTop:4}}>📎 แนบสลิปแล้ว: {stu.slip}</div>}
            </div>
          }/>

          {/* ปุ่มอัปโหลดสลิป */}
          <Btn ch="📤 อัปโหลดหลักฐานชำระเงิน" ic="upload" onClick={()=>setSlipModal(true)} v={stu.paid?"sec":"pri"} full style={{marginBottom:10}}/>

          <Card ch={
            <div>
              <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>💳 ประวัติการชำระเงิน</div>
              {[["ภาค 2/2567","฿20,000","2568-01-15","ok"],["ภาค 1/2567","฿20,000","2567-06-15","ok"],["ภาค 1/2568","฿20,000","รอชำระ","bad"]].map(([t,a,d,s])=>(
                <div key={t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:C.faint}}>{d}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700}}>{a}</div><Chip text={s==="ok"?"ชำระแล้ว":"ค้างชำระ"} type={s} sm/></div>
                </div>
              ))}
            </div>
          }/>
        </div>
      )}

      {/* ── เอกสาร ── */}
      {tab==="docs"&&(
        <div className="in">
          <Btn ch="📤 อัปโหลดเอกสารของฉัน" ic="upload" onClick={()=>setDocModal(true)} full style={{marginBottom:10}}/>
          <Card ch={
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📁 เอกสารของฉัน</div>
              {stu.docs.length>0?stu.docs.map(d=>(
                <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:13}}>📄 {d}</span>
                  <Btn ic="download" ch="ดาวน์โหลด" v="sec" sz="sm" onClick={()=>toast(`ดาวน์โหลด "${d}" แล้ว`)}/>
                </div>
              )):<div style={{textAlign:"center",padding:20,color:C.faint,fontSize:13}}>ยังไม่มีเอกสาร</div>}
            </div>
          }/>
          <HR text="ขอเอกสารออนไลน์"/>
          {[{n:"ใบรับรองนักศึกษา",d:"1 วัน"},{n:"Transcript (ไม่เป็นทางการ)",d:"1 วัน"},{n:"Transcript (เป็นทางการ)",d:"3 วัน"},{n:"ใบรับรองสำเร็จการศึกษา",d:"5 วัน"}].map(doc=>(
            <div key={doc.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.white,borderRadius:9,marginBottom:6,border:`1px solid ${C.border}`}}>
              <div><div style={{fontSize:13,fontWeight:600}}>{doc.n}</div><div style={{fontSize:11,color:C.faint}}>รอ {doc.d} ทำการ</div></div>
              <Btn ic="download" ch="ขอ" sz="sm" onClick={()=>toast(`ขอ "${doc.n}" แล้ว`)}/>
            </div>
          ))}
        </div>
      )}

      {/* ── ปรึกษาอาจารย์ (ปุ่มหลัก Part 2) ── */}
      {tab==="advisor"&&(
        <div className="in">
          <Card style={{background:"linear-gradient(135deg,#1B3A7A,#C8973F)",color:"#fff",padding:16}} ch={
            <div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>👨‍🏫 อาจารย์ที่ปรึกษาของคุณ</div>
              <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{stu.advisor}</div>
              <div style={{fontSize:12,opacity:.85}}>พร้อมให้คำปรึกษาตลอด</div>
            </div>
          }/>
          <Card ch={
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>ติดต่ออาจารย์ที่ปรึกษา</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <Btn ic="chat" ch="แชท LINE" onClick={()=>toast("เปิด LINE อาจารย์ที่ปรึกษา")} full/>
                <Btn ic="star" ch="นัดหมาย" v="sec" onClick={()=>toast("เปิดระบบนัดหมาย")} full/>
              </div>
              <Btn ic="send" ch="ส่งข้อความถึงอาจารย์" v="sec" onClick={()=>toast("เปิดแชทกับอาจารย์")} full style={{marginTop:8}}/>
            </div>
          }/>
          <Card ch={
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📝 ประวัติคำปรึกษา</div>
              {stu.notes.length>0?stu.notes.map((n,i)=>(
                <div key={i} style={{fontSize:12,color:C.mute,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>{n}</div>
              )):<div style={{textAlign:"center",padding:16,color:C.faint,fontSize:12}}>ยังไม่มีบันทึกคำปรึกษา</div>}
            </div>
          }/>
        </div>
      )}
    </div>
  );
};

/* ── 2.3 Broadcast แจ้งเตือน ── */
const Screen_Notify=({students,toast})=>{
  const [notifs,setNotifs]=useState(NOTIFS_INIT);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",body:"",type:"event"});
  const typeMap={payment:{l:"💰 ค่าเทอม",c:"warn"},event:{l:"🎉 กิจกรรม",c:"info"},exam:{l:"📝 สอบ",c:"purple"},announce:{l:"📢 ประกาศ",c:"def"}};

  return(
    <div className="up">
      <HDR ic="bell" title="แจ้งเตือน LINE OA" sub={`ส่งถึงนักศึกษา ${students.length} คน`}/>
      <Btn ic="send" ch="+ สร้างการแจ้งเตือน Broadcast" onClick={()=>setShow(true)} full style={{marginBottom:14}}/>

      <div style={{background:`linear-gradient(135deg,${C.ink},#1c3450)`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontWeight:700,color:"#C8973F",marginBottom:9,fontSize:13}}>📊 ส่งได้ 3 รูปแบบ</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
          {[["👥","Broadcast","ทุกคน"],["🏛️","เฉพาะคณะ","เฉพาะกลุ่ม"],["👤","เฉพาะบุคคล","รายคน"]].map(([e,t,s])=>(
            <div key={t} style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"9px 6px",textAlign:"center"}}>
              <div style={{fontSize:18}}>{e}</div>
              <div style={{fontSize:10,fontWeight:700,color:"#C8973F",marginTop:3}}>{t}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.5)"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <HR text="ประวัติการแจ้งเตือน"/>
      {notifs.map(n=>(
        <Card key={n.id} style={{padding:13}} ch={
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontWeight:700,fontSize:13,flex:1,marginRight:8}}>{n.title}</div>
              <Chip text={typeMap[n.type]?.l||"ทั่วไป"} type={typeMap[n.type]?.c||"def"} sm/>
            </div>
            <div style={{fontSize:12,color:C.mute,lineHeight:1.65,marginBottom:7}}>{n.body}</div>
            <div style={{display:"flex",gap:7}}>
              <Chip text={`✓ ส่ง ${n.sent} คน`} type="ok" sm/>
              <span style={{fontSize:11,color:C.faint}}>{n.date}</span>
            </div>
          </div>
        }/>
      ))}

      {show&&(
        <Modal title="📢 สร้างการแจ้งเตือน" onClose={()=>setShow(false)} ch={
          <div>
            <Inp label="หัวข้อ *" val={form.title} set={v=>setForm({...form,title:v})} ph="เช่น แจ้งชำระค่าเทอม"/>
            <Sel label="ประเภท" val={form.type} set={v=>setForm({...form,type:v})} opts={Object.entries(typeMap).map(([k,v])=>({v:k,l:v.l}))}/>
            <Inp label="ข้อความ *" val={form.body} set={v=>setForm({...form,body:v})} ph="รายละเอียด..." rows={4}/>
            <div style={{background:C.gl,border:"1px solid #1B3A7A30",borderRadius:8,padding:"10px 12px",marginBottom:12,fontSize:12,color:C.gd}}>
              📤 จะส่ง Broadcast ถึงนักศึกษาทั้งหมด <strong>{students.length} คน</strong> ผ่าน LINE OA
            </div>
            <Btn ic="send" ch="ส่ง Broadcast" onClick={()=>{const n={...form,id:Date.now(),date:new Date().toISOString().slice(0,10),sent:students.length};setNotifs([n,...notifs]);setShow(false);toast(`ส่ง Broadcast สำเร็จ! ${students.length} คน`);}} dis={!form.title||!form.body} full/>
          </div>
        }/>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════ */
const P1_TABS=[
  {id:"institution",l:"สถาบัน",n:"build"},
  {id:"faculty",l:"คณะ/สาขา",n:"book"},
  {id:"transfer",l:"เทียบโอน",n:"swap"},
  {id:"tuition",l:"ค่าใช้จ่าย",n:"wallet"},
  {id:"advisor",l:"อาจารย์",n:"chat"},
];
const P2_TABS=[
  {id:"admin",l:"Admin",n:"shield"},
  {id:"student",l:"นักศึกษา",n:"person"},
  {id:"notify",l:"แจ้งเตือน",n:"bell"},
];

export default function App(){
  const [part,setPart]=useState(1);
  const [tab,setTab]=useState("institution");
  const [students,setStudents]=useState(INIT_STU);
  const [prospects,setProspects]=useState(INIT_PROSPECTS);
  const [toastData,setToastData]=useState(null);
  const bodyRef=useRef(null);

  const toast=(msg,ok=true)=>{setToastData({msg,ok});setTimeout(()=>setToastData(null),2700);};
  const switchPart=(p)=>{setPart(p);setTab(p===1?"institution":"admin");if(bodyRef.current)bodyRef.current.scrollTop=0;};

  const tabs=part===1?P1_TABS:P2_TABS;

  const render=()=>{
    const props={students,setStudents,prospects,setProspects,toast};
    if(part===1){
      if(tab==="institution") return <Screen_Institution goAdvisor={()=>setTab("advisor")} toast={toast}/>;
      if(tab==="faculty") return <Screen_Faculty {...props}/>;
      if(tab==="transfer") return <Screen_Transfer {...props}/>;
      if(tab==="tuition") return <Screen_Tuition/>;
      if(tab==="advisor") return <Screen_AdvisorPre {...props}/>;
    }else{
      if(tab==="admin") return <Screen_Admin {...props}/>;
      if(tab==="student") return <Screen_StudentPortal {...props}/>;
      if(tab==="notify") return <Screen_Notify {...props}/>;
    }
  };

  return(
    <>
      <style>{STYLE}</style>
      <div style={{fontFamily:"'IBM Plex Sans Thai','IBM Plex Sans',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:500,margin:"0 auto",display:"flex",flexDirection:"column",position:"relative"}}>
        {toastData&&<Toast msg={toastData.msg} ok={toastData.ok}/>}

        {/* ── Header ── */}
        <div style={{background:"linear-gradient(135deg,#0D1E42 0%,#1B3A7A 60%,#1A5FAD 100%)",padding:"13px 15px 0",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 20px rgba(13,30,66,0.45)"}}>
          {/* Brand */}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}>
            <div style={{width:34,height:34,background:"rgba(200,151,63,0.25)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontWeight:900,fontSize:12,color:"#C8973F",letterSpacing:"-0.5px"}}>SAU</span>
            </div>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,lineHeight:1.2}}>มหาวิทยาลัยเอเชียอาคเนย์ (SAU)</div>
              <div style={{color:"rgba(255,255,255,.68)",fontSize:10}}>LINE Official Account · @iamsau</div>
            </div>
            <div style={{background:"rgba(255,255,255,.2)",borderRadius:20,padding:"3px 9px",fontSize:10,fontWeight:700,color:"#fff"}}>🟢 Online</div>
          </div>

          {/* Part switcher */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:9}}>
            {[{p:1,l:"🏫 รับสมัครนักศึกษา",s:"Recruitment"},{p:2,l:"🎓 ระบบนักศึกษา",s:"Student System"}].map(({p,l,s})=>(
              <button key={p} onClick={()=>switchPart(p)} style={{background:part===p?"#fff":"rgba(255,255,255,.16)",color:part===p?"#1B3A7A":"#fff",border:"none",borderRadius:9,padding:"8px 6px",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                <div style={{fontWeight:700,fontSize:11}}>{l}</div>
                <div style={{fontSize:9,opacity:part===p?.55:.68,marginTop:1}}>{s}</div>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id);if(bodyRef.current)bodyRef.current.scrollTop=0;}}
                style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"7px 10px 6px",border:"none",background:"none",cursor:"pointer",borderBottom:tab===t.id?"2.5px solid #fff":"2.5px solid transparent",opacity:tab===t.id?1:.5,fontFamily:"inherit"}}>
                <Ico n={t.n} s={15} c="#fff"/>
                <span style={{fontSize:9,fontWeight:tab===t.id?700:400,color:"#fff",whiteSpace:"nowrap"}}>{t.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div ref={bodyRef} style={{flex:1,padding:"14px 14px 80px",overflowY:"auto"}}>
          {render()}
        </div>

        {/* ── Footer ── */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,background:C.white,borderTop:`1px solid ${C.border}`,padding:"7px 16px 13px",textAlign:"center",zIndex:40}}>
          <div style={{fontSize:10,color:C.faint}}>🔒 ระบบปลอดภัยตาม PDPA 2562 · มหาวิทยาลัยเอเชียอาคเนย์ (SAU) © 2568 · 02-807-4500</div>
        </div>
      </div>
    </>
  );
}
