/**
 * inkEngine's 36-entry ink palette (COLOR_PALETTE / setBrushColorName, NAME-MAP _j222/_j136).
 * Ids are brushColorMode values; the encode shader picks the same RGB by id. Some names do not
 * describe their colour (13 blue_gray is a rust red, 27 dusty_rose is a pale cyan); they are kept
 * so a preset reads exactly like the inkEngine/index.html colour menu.
 * Ported with attribution under the owner-stated inkField authorization.
 */

export type InkColorName =
  | 'black' | 'white' | 'dark_gray' | 'medium_gray_new' | 'light_gray_new' | 'green' | 'orange' | 'brown'
  | 'green_dark' | 'blue_dark' | 'purple' | 'lime' | 'light_gray' | 'blue_gray' | 'terra_cotta' | 'olive_green'
  | 'pink' | 'wine_red' | 'gold_orange' | 'gray_brown' | 'sage_gray' | 'brick_red' | 'silver' | 'beige'
  | 'gray_green' | 'tan' | 'khaki' | 'dusty_rose' | 'mauve_gray' | 'medium_gray' | 'red' | 'yellow' | 'blue'
  | 'custom' | 'coral' | 'mint';

export interface InkColorEntry {
  readonly id: number;
  readonly name: InkColorName;
  readonly rgb: readonly [number, number, number];
  readonly label: string;
}

export const INK_PALETTE: readonly InkColorEntry[] = [
  { id: 0, name: 'black', rgb: [26, 26, 26], label: '黑色' },
  { id: 1, name: 'white', rgb: [242, 242, 242], label: '白色' },
  { id: 2, name: 'dark_gray', rgb: [47, 47, 47], label: '深灰色' },
  { id: 3, name: 'medium_gray_new', rgb: [85, 85, 85], label: '中灰色' },
  { id: 4, name: 'light_gray_new', rgb: [150, 150, 150], label: '浅灰色' },
  { id: 5, name: 'green', rgb: [63, 77, 24], label: '绿色' },
  { id: 6, name: 'orange', rgb: [255, 160, 62], label: '橙色' },
  { id: 7, name: 'brown', rgb: [175, 140, 89], label: '咖啡色' },
  { id: 8, name: 'green_dark', rgb: [4, 130, 130], label: '墨绿色' },
  { id: 9, name: 'blue_dark', rgb: [57, 80, 192], label: '深蓝色' },
  { id: 10, name: 'purple', rgb: [140, 106, 172], label: '紫色' },
  { id: 11, name: 'lime', rgb: [138, 149, 73], label: '浅绿色' },
  { id: 12, name: 'light_gray', rgb: [136, 122, 125], label: '浅灰色' },
  { id: 13, name: 'blue_gray', rgb: [138, 57, 26], label: '蓝灰色' },
  { id: 14, name: 'terra_cotta', rgb: [112, 79, 57], label: '赭石色' },
  { id: 15, name: 'olive_green', rgb: [168, 200, 72], label: '橄榄绿' },
  { id: 16, name: 'pink', rgb: [240, 170, 207], label: '粉红色' },
  { id: 17, name: 'wine_red', rgb: [128, 49, 52], label: '酒红色' },
  { id: 18, name: 'gold_orange', rgb: [233, 175, 52], label: '金橙色' },
  { id: 19, name: 'gray_brown', rgb: [128, 125, 114], label: '灰褐色' },
  { id: 20, name: 'sage_gray', rgb: [121, 132, 129], label: '鼠尾草灰' },
  { id: 21, name: 'brick_red', rgb: [159, 114, 85], label: '砖红色' },
  { id: 22, name: 'silver', rgb: [181, 180, 185], label: '银灰色' },
  { id: 23, name: 'beige', rgb: [235, 220, 201], label: '米色' },
  { id: 24, name: 'gray_green', rgb: [148, 162, 158], label: '青灰色' },
  { id: 25, name: 'tan', rgb: [210, 169, 151], label: '驼色' },
  { id: 26, name: 'khaki', rgb: [165, 162, 147], label: '卡其色' },
  { id: 27, name: 'dusty_rose', rgb: [203, 243, 251], label: '雾玫瑰色' },
  { id: 28, name: 'mauve_gray', rgb: [174, 161, 164], label: '淡紫灰' },
  { id: 29, name: 'medium_gray', rgb: [155, 155, 155], label: '中灰色' },
  { id: 30, name: 'red', rgb: [208, 34, 63], label: '红色' },
  { id: 31, name: 'yellow', rgb: [255, 249, 56], label: '黄色' },
  { id: 32, name: 'blue', rgb: [2, 66, 109], label: '蓝色' },
  { id: 33, name: 'custom', rgb: [26, 26, 26], label: '自定义' },
  { id: 34, name: 'coral', rgb: [255, 127, 80], label: '珊瑚色' },
  { id: 35, name: 'mint', rgb: [152, 251, 152], label: '薄荷绿' },
];

export const INK_COLOR_NAMES: readonly InkColorName[] = INK_PALETTE.map(color => color.name);

export function inkColorId(name: InkColorName): number {
  return INK_PALETTE.find(color => color.name === name)?.id ?? 0;
}

export function inkColorRgb(id: number): readonly [number, number, number] {
  return INK_PALETTE.find(color => color.id === id)?.rgb ?? [26, 26, 26];
}
