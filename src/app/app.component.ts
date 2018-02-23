import { Component, Input, OnInit } from '@angular/core';

// used to convert between 16M color palette and reduced set defined by three alphabetic characters
const fullColorFactor = 954.6068278805121; //954.5525147928994 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // characters that show up in the code box
  @Input() codeOutputChars:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  base26Chars:string = '0123456789ABCDEFGHIJKLMNOP';
  // allow upper and lower in code box, then convert to upper
  @Input() codeInputChars:string = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
  @Input() messageEncodeChars:string = '0aAbBcC1dDeEfF2gGhHiI3jJkKlL4mMnNoO5pPqQrR6sStTuU7vVwWxX8yYzZ9';
  // allow more characters than are actually encoded; excess characters pass through without encoded/decoding
  @Input() messageAllowedChars:string = ' .0aAbBcC1dDeEfF2gGhHiI3jJkKlL4mMnNoO5pPqQrR6sStTuU7vVwWxX8yYzZ9-';

  baseColor:Color = this.hexToColor('#ffffff');
  myPrivateColor:Color = this.hexToColor('#ffffff');
  myPublicColor:Color = this.hexToColor('#ffffff');
  friendsPublicColor:Color = this.hexToColor('#ffffff');
  sharedSecretColor:Color = this.hexToColor('#ffffff');

  // message input box backing values
  @Input() encode:string = 'Fourth Grade Rules';
  encoded:string = '';
  @Input() decode:string = '';
  decoded:string = '';

  @Input() unknown: boolean = false;

  constructor() { }

  ngOnInit() { }

  hexToColor(hexColorValue:string):Color{
    // console.log('start hexToColor: ' + hexColorValue);
    hexColorValue = hexColorValue.toLowerCase();
    let smallDecimal = this.hexToSmallDecimal(hexColorValue);
    // console.log("hexToSmallDecimal: " + smallDecimal);

    return this.smallDecimalToColor(smallDecimal);
  }

  smallDecimalToColor(smallDecimal:number):Color {
    let color = {hex:this.smallDecimalToHex(smallDecimal), small:smallDecimal, code:this.smallDecimalToCode(smallDecimal), alpha:this.smallDecimalToAlpha(smallDecimal)};
    // console.log('hexToColor: ' + color.hex + ', ' + color.code + ', ' + color.small + ', ' + color.alpha);

    return color;
  }

  colorInput(colorName:string, hexColorValue:string){
    hexColorValue = hexColorValue.toLowerCase();
    this[colorName] = this.hexToColor(hexColorValue);

    this.calculateValues();
  }

  codeInput(colorName:string) {
    this[colorName].code = this[colorName].code.toUpperCase(); // force uppercase

    let code:string = this[colorName].code.toUpperCase();
    let smallDecimal = this.codeToSmallDecimal(code);
    let hex = this.smallDecimalToHex(smallDecimal);
    this[colorName] = this.hexToColor(hex);

    // TODO: if base color changed... warn to make sure friend has same base color

    this.calculateValues();
  }

  calculateValues() {
    console.log('calculating colors');
    if (this.myPrivateColor && this.baseColor){
      // calculate my public color
      // this.myPublicColor = this.blendColors(this.baseColor, this.myPrivateColor, 0.5);
      this.myPublicColor = this.fakeBlend(this.baseColor, this.myPrivateColor, 0.5);
      if (this.friendsPublicColor){
  
        // calculate the shared secret color
        // this.sharedSecretColor = this.blendColors(this.friendsPublicColor, this.myPrivateColor, 0.66666666);
        this.sharedSecretColor = this.fakeBlend(this.friendsPublicColor, this.myPrivateColor, 0.66666666);
        this.encrypt();
        this.decrypt();
      }
    }
  }

  codeToHex(code:string):string {
    // scrub by converting to small decimal value first
    let smallDecimal = this.codeToSmallDecimal(code);

    return this.smallDecimalToHex(smallDecimal);
  }

  hexToSmallDecimal(hexColorValue:string):number {
    let hexNumber = hexColorValue.replace('#','');
    let fullValue = parseInt(hexNumber, 16);

    return this.scrubSmallDecimal(Math.ceil(fullValue / fullColorFactor));
  }

  scrubSmallDecimal(smallDecimal:number):number {
    return Math.max(Math.min(Math.ceil(smallDecimal), (26 + Math.pow(26, 2) + Math.pow(26, 3))), 0);
  }

  smallDecimalToHex(smallDecimal:number):string{
    let fullValue = Math.floor(smallDecimal*fullColorFactor);

    return '#' + this.padLeft(fullValue.toString(16), '0', 6);
  }

  codeToSmallDecimal(code:string):number{
    let base26:string = '';
    for (var codeIndex=0; codeIndex < code.length; codeIndex++) {
      let letter = code[codeIndex];
      let letterIndex = this.codeOutputChars.indexOf(letter);
      base26 = base26 + this.base26Chars[letterIndex];
    }

    let smallDecimal = parseInt(base26, 26);
    return smallDecimal;
  }

  smallDecimalToCode(smallDecimal:number):string {
    let code:string = '';
    let base26 = smallDecimal.toString(26);
    for (var baseIndex=0; baseIndex < base26.length; baseIndex++) {
      let val = base26[baseIndex].toUpperCase();
      let valIndex = this.base26Chars.indexOf(val);
      code = code + this.codeOutputChars[valIndex];
    }

    return code;
  }

  padLeft(text:string, padChar:string, size:number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  randomizeColor(colorName:string) {
    let colorCodes: string[] = 
      ['BAT','CAT','HAT','MAT','PAT','SAT','BIT','FIT','HIT','PIT','SIT','DOT','HOT','LOT','NOT','ROT','CUT','HUT','NUT','ACT','AFT','ANT','ART',
      'BET','BUT','EAT','FAT','GET','GOT','GUT','JOT','JUT','KIT','LET','LIT','MET','NET','OAT','OFT','OPT','OUT','PET','PUT','RAT','RUT','SET',
      'TOT','VET','WET','WIT','YET','BOA','AVA','PEA','SEA','SPA','TEA','BOO','BIO','AGO','BRO','COO','DUO','GOO','MOO','TOO','TWO','WHO','ZOO',
      'SKI','EMU','FLU','YOU','ACE','AGE','APE','ARE','ATE','AVE','AXE','BEE','BYE','CUE','DIE','DUE','DYE','EVE','EWE','EYE','FEE','FOE','GEE',
      'HOE','HUE','ICE','IRE','JOE','LEE','LIE','ODE','ONE','ORE','OWE','PIE','SEE','SHE','SUE','TEE','THE','TIE','TOE','USE','WEE','WOE','BOW',
      'COW','DEW','FEW','HOW','JAW','LAW','LOW','MOW','NOW','PAW','PEW','POW','RAW','ROW','SAW','SOW','TOW','WOW','CAR','EAR','JAR','TAR','AIR',
      'FAR','FIR','FOR','FUR','HER','NOR','OAR','OUR','PAR','SIR','ANY','BAY','BOY','BUY','COY','CRY','DAY','FRY','DRY','FLY','GUY','HAY','HEY',
      'ICY','IVY','JAY','JOY','KEY','LAY','MAY','PAY','PLY','PRY','RAY','SAY','SHY','SKY','SLY','SOY','SPY','STY','TOY','TRY','WAY','WHY','YAY',
      'AMP','APP','BOP','CAP','COP','CUP','DIP','GAP','HIP','HOP','IMP','LAP','LIP','LOP','MAP','MOP','NAP','NIP','POP','PUP','RAP','RIP','SAP',
      'SIP','SOP','TAP','TIP','TOP','UMP','YAP','YEP','ZAP','ZIP','ABS','ADS','BUS','GAS','HAS','HIS','ITS','OPS','PUS','UPS','WAS','YES','ADD',
      'AID','AND','BAD','BED','BID','BUD','COD','DAD','DID','DUD','END','FAD','FED','GOD','HAD','HID','LAD','LED','LID','MAD','MID','MUD','NOD',
      'ODD','OLD','PAD','POD','RED','RID','ROD','SAD','SOD','TAD','WED','ARF','ELF','OAF','REF','RIF','BAG','BEG','BIG','BPG','BUG','COG','DIG',
      'DOG','EGG','FIG','FOG','GAG','GIG','HAG','HOG','HUG','JAG','JIG','JOG','JUG','KEG','LAG','LEG','LOG','LUG','MUG','NAG','PEG','PIG','PUG',
      'RAG','RIG','RUG','SAG','TAG','TUG','WAG','WIG','ZIG','ZAG','ASH','DUH','BAH','HAH','HEH','NAH','OOH','UGH','ARK','ASK','ELK','ILK','INK',
      'IRK','OAK','WOK','YAK','AIL','ALL','AWL','EEL','GAL','GEL','ILL','NIL','OIL','OWL','PAL','FEZ','FIZ','WIZ','BOX','FAX','FIX','FOX','HEX',
      'LAX','MAX','MIX','NIX','POX','REX','SAX','SIX','TAX','TUX','VEX','WAX','ARC','DOC','HIC','MAC','PIC','REC','TIC','VAC','LUV','BIB','BOB',
      'BUB','CAB','COB','DAB','DIB','DUB','EBB','FIB','FOB','FUB','GAB','GOB','JAB','JOB','LAB','LOB','MOB','NAB','NIB','ORB','RIB','ROB','RUB',
      'SOB','SUB','TAB','TUB','WEB','BAN','BEN','BIN','BUN','CAN','CON','DEN','DIN','DON','EON','FAN','FIN','FUN','GUN','HEN','INN','ION','KIN',
      'MAN','MEN','NUN','OWN','PAN','PEN','PIN','PUN','RAN','RUN','SIN','SON','SUN','TAN','TEN','TIN','TON','URN','VAN','WIN','WON','YEN','YON',
      'AIM','ARM','BAM','BUM','CAM','DIM','ELM','GEM','GUM','GYM','JIM','HAM','HEM','HIM','HUM','JAM','MOM','MUM','OHM','RAM','RIM','SUM','YUM'];

    let codeCount = colorCodes.length;
    let index = this.randomInteger(1, codeCount) - 1;
    this[colorName].code = colorCodes[index];

    this.codeInput(colorName);
  }

  randomInteger(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  fakeBlend(color1:Color, color2:Color, percentage:number):Color {
    return this.smallDecimalToColor((color1.small + color2.small) % Math.pow(26, 3))
  }

  blendColors(color1:Color, color2:Color, percentage:number):Color {
   let hex = this.rgbToHex(this.blendRGB(this.hexToRgb(color1.hex), this.hexToRgb(color2.hex), percentage)); // already scrubbed

   return this.hexToColor(hex);
  }

  blendRGB(color1:number[], color2:number[], percentage:number):number[]{
    return [ 
      Math.round((1 - percentage) * color1[0] + percentage * color2[0]), 
      Math.round((1 - percentage) * color1[1] + percentage * color2[1]), 
      Math.round((1 - percentage) * color1[2] + percentage * color2[2])
    ];
  }

  componentToHexFragment(c:number):string {
    let hex = Math.round(c).toString(16)
    // var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(rgb:number[]):string {
    let hex = "#" + this.componentToHexFragment(rgb[0]) + this.componentToHexFragment(rgb[1]) + this.componentToHexFragment(rgb[2]);

    // scrub the hex value by converting to small decimal value first
   let smallDecimal = this.hexToSmallDecimal(hex);

   return this.smallDecimalToHex(smallDecimal);
  }

  hexToRgb(hex:string):number[] {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)] : null;
  }

  smallDecimalToAlpha(smalldecimal:number):string {
    let result:string = '';
    let hex = this.smallDecimalToHex(smalldecimal);
    for(var i = 1; i < hex.length; i++){ // skip hash character at beginning
      result = result + String.fromCharCode(65 + parseInt(hex.charAt(i), 16))
    }

    return result;
  }
  
  // Encrypt a given text using key 
  encrypt() {
    this.encoded = Array.prototype.map.call(this.encode, (letter: string, index: number): string => {
      if (this.messageEncodeChars.indexOf(letter) < 0 || letter == ' ') return letter;
      let shift = this.shiftBy(index);
      let newIndex = (this.messageEncodeChars.indexOf(letter) + shift) % this.messageEncodeChars.length;

      return this.messageEncodeChars[newIndex];
    }).join('')
  }

  // Decrypt ciphertext based on key 
  decrypt() {
    this.decoded = Array.prototype.map.call(this.decode, (letter: string, index: number): string => {
      if (this.messageEncodeChars.indexOf(letter) < 0 || letter == ' ') return letter;
      let reversedChars = this.messageEncodeChars.split("").reverse().join("");
      let shift = this.shiftBy(index);
      let newIndex = (reversedChars.indexOf(letter) + shift) % reversedChars.length;

      return reversedChars[newIndex];
    }).join('')
  }

  shiftBy(index:number):number {
    let shiftByIndex = index % this.sharedSecretColor.alpha.length;
    let shiftByChar = this.sharedSecretColor.alpha[shiftByIndex];
    let shiftBy = this.messageEncodeChars.indexOf(shiftByChar);

    return shiftBy
  }

  /** Converts to uppercase and removes non characters */
  // formatText(text: string): string {
  //   return text.toUpperCase().replace(/[^A-Z ]/g, "")
  //   // return text;
  // }

}

interface Color {
  hex:string,
  small:number,
  // rgb:number[],
  code:string,
  alpha:string
}