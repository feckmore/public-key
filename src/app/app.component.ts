import { Component, Input, OnInit } from '@angular/core';

// used to convert between 16M color palette and reduced set defined by three alphabetic characters
const fullColorFactor = 852.4141855; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // characters that show up in the code box
  @Input() codeOutputChars:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // allow upper and lower in code box, then convert to upper
  @Input() codeInputChars:string = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
  @Input() messageEncodeChars:string = '0aAbBcC1dDeEfF2gGhHiI3jJkKlL4mMnNoO5pPqQrR6sStTuU7vVwWxX8yYzZ9';
  // allow more characters than are actually encoded; excess characters pass through without encoded/decoding
  @Input() messageAllowedChars:string = ' .0aAbBcC1dDeEfF2gGhHiI3jJkKlL4mMnNoO5pPqQrR6sStTuU7vVwWxX8yYzZ9-';

  baseColor:Color = this.hexToColor('#FFFFFF');
  myPrivateColor:Color = this.hexToColor('#FFFFFF');
  myPublicColor:Color = this.hexToColor('#FFFFFF');
  friendsPublicColor:Color = this.hexToColor('#FFFFFF');
  sharedSecretColor:Color = this.hexToColor('#FFFFFF');

  // message input box backing values
  @Input() encode:string = 'Fourth Grade Rules';
  encoded:string = '';
  @Input() decode:string = '';
  decoded:string = '';

  @Input() unknown: boolean = false;

  constructor() { }

  ngOnInit() { }

  hexToColor(hexColorValue:string):Color{
    let color = {hex:hexColorValue, rgb:this.hexToRgb(hexColorValue), code:this.hexToCode(hexColorValue), alpha:this.hexToAlpha(hexColorValue)};
    console.log(color);
    return color;
  }

  colorInput(colorName:string, hexColorValue:string){
    this[colorName] = this.hexToColor(hexColorValue);

    this.calculateValues();
  }

  codeInput(colorName:string) {
    let text:string = this[colorName].code.toUpperCase();
    this[colorName].code = text; // force uppercase

    let hex = this.codeToHex(text);
    this[colorName] = this.hexToColor(hex);

    // TODO: if base color changed... warn to make sure friend has same base color

    this.calculateValues();
  }

  calculateValues() {
    console.log('calculating colors');
    if (this.myPrivateColor && this.baseColor){
      // calculate my public color
      this.myPublicColor = this.hexToColor(this.blendHex(this.myPrivateColor.hex, this.baseColor.hex, 0.50));

      if (this.friendsPublicColor){
        // calculate the shared secret color
        this.sharedSecretColor = this.hexToColor(this.blendHex(this.myPrivateColor.hex, this.friendsPublicColor.hex, 0.50))
        this.encrypt();
        this.decrypt();
      }
    }
  }

  letterPositions(text:string):number[]{
    let positions:number[] = [0,0,0];
    for (var index=0; index < text.length; index++) { 
      let char = text.charAt(index);
      let position = this.codeOutputChars.indexOf(char) + 1;
      positions[index] = position;
    }

    return positions;
  }

  codeToHex(text:string):string {
    let positions = this.letterPositions(text);
    let reducedValue = positions[2] + positions[1] * 27 + positions[0] * 729;
    let fullValue = Math.floor(reducedValue*fullColorFactor);

    let hexColorValue = '#' + this.padLeft(fullValue.toString(16), '0', 6);

    console.log(reducedValue + ',' + fullValue + ',' + hexColorValue + ',[' + positions[0] + ',' + positions[1] + ',' + positions[2] + ']');
    return hexColorValue;
  }

  hexToCode(hexColorValue:string):string {
    let hexValue = hexColorValue.replace('#','');
    let fullValue = parseInt(hexValue, 16);
    let reducedValue = Math.ceil(fullValue / fullColorFactor);
    let positions:number[] = [0,0,0];
    positions[0] = Math.floor(reducedValue / 729);
    positions[1] = Math.floor((reducedValue % 729)/27);
    positions[2] = Math.floor((reducedValue % 729) % 27);

    console.log(reducedValue + ',' + fullValue + ',' + hexColorValue + ',[' + positions[0] + ',' + positions[1] + ',' + positions[2] + ']');
    let text:string
    text = positions[0] > 0 ? this.codeOutputChars[positions[0] - 1] : '';
    text = text + (positions[1] > 0 ? this.codeOutputChars[positions[1] - 1] : '');
    text = text + (positions[2] > 0 ? this.codeOutputChars[positions[2] - 1] : '');
    
    return text;
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

  blendHex(color1:string, color2:string, percentage:number):string {
    return this.rgbToHex(this.blendRGB(this.hexToRgb(color1), this.hexToRgb(color2), percentage));
  }

  blendRGB(color1:number[], color2:number[], percentage:number):number[]{
    return [ 
      Math.round((1 - percentage) * color1[0] + percentage * color2[0]), 
      Math.round((1 - percentage) * color1[1] + percentage * color2[1]), 
      Math.round((1 - percentage) * color1[2] + percentage * color2[2])
    ];
  }

  componentToHex(c:number):string {
    let hex = Math.round(c).toString(16)
    // var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(rgb:number[]):string {
    return "#" + this.componentToHex(rgb[0]) + this.componentToHex(rgb[1]) + this.componentToHex(rgb[2]);
  }

  hexToRgb(hex:string):number[] {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)] : null;
  }

  hexToAlpha(hex:string):string {
    let result:string = '';
    for(var i = 1; i < hex.length; i++){ // skip hash character at beginning
      // console.log('hex[' + i + ']: ' + hex.charAt(i) + ', ' + String.fromCharCode(33 + parseInt(hex.charAt(i), 16)));
      result = result + String.fromCharCode(65 + parseInt(hex.charAt(i), 16))
    }
    // console.log('alpha: ' + result);
    return result;
  }

  

  /** Enrypt a given text using key */
  encrypt() {
    // console.log('encrypting ' + this.encode);
    this.encoded = Array.prototype.map.call(this.encode, (letter: string, index: number): string => {
      if (this.messageEncodeChars.indexOf(letter) < 0 || letter == ' ') return letter;
      let shift = this.shiftBy(index);
      let newIndex = (this.messageEncodeChars.indexOf(letter) + shift) % this.messageEncodeChars.length;
      // console.log('shift:' + shift + ', index:' + newIndex + ', char:' + this.messageEncodeChars[newIndex] + ', map:'  + this.messageEncodeChars)
      return this.messageEncodeChars[newIndex];
    }).join('')
  }

  /** Decrypt ciphertext based on key */
  decrypt() {
    // console.log('decrypting ' + this.decode);
    this.decoded = Array.prototype.map.call(this.decode, (letter: string, index: number): string => {
      if (this.messageEncodeChars.indexOf(letter) < 0 || letter == ' ') return letter;
      let reversedChars = this.messageEncodeChars.split("").reverse().join("");
      let shift = this.shiftBy(index);
      let newIndex = (reversedChars.indexOf(letter) + shift) % reversedChars.length;
      // console.log('shift:' + shift + ', index:' + newIndex + ', char:' + reversedChars[newIndex] + ', map:'  + reversedChars)
      return reversedChars[newIndex];
    }).join('')
  }

  shiftBy(index:number):number {
    let shiftByIndex = index % this.sharedSecretColor.alpha.length;
    let shiftByChar = this.sharedSecretColor.alpha[shiftByIndex];
    let shiftBy = this.messageEncodeChars.indexOf(shiftByChar);
    // console.log('alpha:' + this.sharedSecretColor.alpha + ", index:" + index + ', shiftByIndex:' + shiftByIndex + ', shiftByChar: ' + shiftByChar + ', shiftBy:' + shiftBy);
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
  rgb:number[],
  code:string,
  alpha:string
}