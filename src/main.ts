import { fromSVG, toSVG } from './svg/convert'
import { format, path } from './gcode/gcode'

//console.log(convert("M297.22050280799976 841.4268744144958 C280.96542559065574 854.3820909746878 262.8416043273598 864.364864958496 242.8482365228158 871.375463864352 C222.8546012198398 878.2338561624 202.0483056804478 881.662918562208 180.42934990463982 881.662918562208 C163.8492620924158 881.662918562208 147.83841094348804 879.6047856264 132.39626146099204 875.4919972344001 C117.11648352672003 871.527937970592 102.81227237395177 865.8880010303039 89.48309300582378 858.5727214103999 C76.15418113612778 851.1049676842559 63.96294009772766 842.2665519925441 52.90963738905566 832.0531943603521 C41.85633468038366 821.6913750984002 32.42861994297581 810.2595621084481 24.626225678399805 797.7615003685441 C16.823831413823804 785.1147095004482 10.728344643839975 771.5501315121601 6.339497870015975 757.0717788801601 C2.1132901428479753 742.5934262481601 0.000052530047696564 727.5800767521599 0.000052530047696564 712.0354753702079 C0.000052530047696564 696.4908739882559 2.1132901428479753 681.5518890563519 6.339497870015975 667.2257430321599 C10.728344643839975 652.8995970079679 16.823831413823804 639.487760624352 24.626225678399805 626.993443862496 C32.42861994297581 614.342908016352 41.85633468038366 602.9110950264 52.90963738905566 592.7014823722559 C63.96294009772766 582.3359181322559 76.15418113612778 573.4972349421121 89.48309300582378 566.1819553222081 C102.81227237395177 558.8666757023041 117.11648352672003 553.2270062604479 132.39626146099204 549.2664244762559 C147.83841094348804 545.1498911062079 163.8492620924158 543.0917581704 180.42934990463982 543.0917581704 C202.0483056804478 543.0917581704 222.8546012198398 546.5989301123519 242.8482365228158 553.6095290182079 C262.8416043273598 560.4679213162559 280.96542559065574 570.3728532563521 297.22050280799976 583.328069816544 L260.64704719123165 640.47991230864 C250.08112662566364 630.422773760736 237.8898855872639 622.5722297783999 224.0733240760319 616.9325603365439 C210.25676256479989 611.140416788448 195.70912783891183 608.246083754208 180.42934990463982 608.246083754208 C165.14957197036782 608.246083754208 150.7640412942719 610.987942682208 137.2724903779199 616.4754055162559 C123.9435785082239 621.9628683503039 112.23998711135978 629.4303545780159 102.16171618732778 638.8783991962559 C92.08371276172778 648.177714686304 84.11894694892777 659.1488953763522 78.26715125049577 671.7994312224962 C72.41562305049577 684.2974929624002 69.48972520127995 697.7093293460159 69.48972520127995 712.0354753702079 C69.48972520127995 726.5138280022079 72.41562305049577 740.0781384920639 78.26715125049577 752.7286743382078 C84.11894694892777 765.3754652063038 92.08371276172778 776.424755438496 102.16171618732778 785.8762775363521 C112.23998711135978 795.3240546561601 123.9435785082239 802.7918083823041 137.2724903779199 808.2792712163521 C150.7640412942719 813.7667340504 165.14957197036782 816.5085929784 180.42934990463982 816.5085929784 C189.20704345228782 816.5085929784 197.74077842995183 815.516708792544 206.03055483763183 813.536417900448 C214.32033124531182 811.556127008352 222.20431253164782 808.8142680803519 229.6816962013438 805.3070961383999 L229.6816962013438 712.0354753702079 L297.22050280799976 712.0354753702079 L297.22050280799976 841.4268744144958 Z "))
const paths = fromSVG("M607.8592720027194 303.9296360013598 C607.8592720027194 471.67296849950276 471.67296849950264 607.8592720027195 303.9296360013597 607.8592720027195 C136.18630350321678 607.8592720027195 2.0542633522216096e-14 471.6729684995028 0 303.9296360013599 C-2.0542633522216096e-14 136.18630350321695 136.18630350321672 1.4450078800494016e-13 303.92963600135965 1.1368683772161603e-13 C471.6729684995026 8.28728874382919e-14 607.8592720027194 136.1863035032169 607.8592720027194 303.9296360013598 Z ")
paths.forEach(p => {
    path(p).forEach(g => console.log(format(g)))
    console.log(toSVG(p))
})
