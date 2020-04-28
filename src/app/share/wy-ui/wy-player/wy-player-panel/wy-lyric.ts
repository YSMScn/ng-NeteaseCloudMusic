import { Lyric } from 'src/app/services/data-types/common-types';
import { skip, timeout } from 'rxjs/internal/operators';
import { from, zip, Subject, Subscription, timer } from 'rxjs';

export interface BaseLyricLine {
    txt: string;
    txtCn: string;
}

interface LyricLine extends BaseLyricLine {
    time: number;
}

interface Handler extends BaseLyricLine {
    lineNum: number;
}

// const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
const timeExp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/;
export class WYLyric {
    private lrc: Lyric;
    lines: LyricLine[] = [];
    private playing = false;
    private currentNum: number;
    private startStamp: number;
    handler = new Subject<Handler>();
    private timer$: Subscription;
    private pauseTime: number;
    constructor(lrc: Lyric) {
        this.lrc = lrc;
        this.init();
    }

    private init() {
        if (this.lrc.tlyric) {
            this.generTLyric();
        } else {
            this.generLyric();
        }
    }

    private generLyric() {
        // console.log(this.lrc.lyric);
        const lines = this.lrc.lyric.split('\n');
        // console.log(lines);
        lines.forEach(line => this.makeLine(line));
        // console.log('lines: ', this.lines);

    }

    private generTLyric() {
        const lines = this.lrc.lyric.split('\n');
        const tLines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) != null);
        // console.log('Lines',lines);
        // console.log('tLines',tLines);
        const moreLine = lines.length - tLines.length;
        let tempArr = [];
        if (moreLine >= 0) {
            tempArr = [lines, tLines];
        } else {
            tempArr = [tLines, lines];
        }
        const first = timeExp.exec(tempArr[1][0])[0];

        const skipIndex = tempArr[0].findIndex(item => {
            const exec = timeExp.exec(item);
            if (exec) {
                return exec[0] === first;
            }
        });
        const _skip = skipIndex === -1 ? 0 : skipIndex;
        const skipItems = tempArr[0].slice(0, _skip);
        if (skipItems) {
            skipItems.forEach(line => this.makeLine(line));
        }

        let zipLines$;
        if (moreLine > 0) {
            zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tLines));
        } else {
            zipLines$ = zip(from(tLines).pipe(skip(_skip)), from(lines));
        }
        zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));

    }

    private makeLine(line: string, tLine= '') {
        const result = timeExp.exec(line);
        // console.log('result: ',result);
        if (result) {
            const txt = line.replace(timeExp, '').trim();
            const txtCn = tLine ? tLine.replace(timeExp, '').trim() : '';
            if (txt) {
                const thirdResult = result[3] || '00';
                const len = thirdResult.length;
                const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
                const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
                this.lines.push({txt, txtCn, time});

            }
        }
    }

    play(startTime = 0, skip = false) {
        if (!this.lines.length) { return; }
        if (!this.playing) {
            this.playing = true;
        }
        this.currentNum = this.findCurrentNum(startTime);
        this.startStamp = Date.now() - startTime;
        if (!skip) {
            this.callHandler(this.currentNum - 1);
        }
        if (this.currentNum < this.lines.length) {
            // clearTimeout(this.timer);
            this.clearTimer();
            this.playReset();

        }

    }

    private clearTimer() {
        this.timer$ && this.timer$.unsubscribe();
    }

    findCurrentNum(time: number): number {
        const index = this.lines.findIndex(item => time <= item.time);
        return index === -1 ? this.lines.length - 1 : index;
    }

    private playReset() {
        const line = this.lines[this.currentNum];
        const delay = line.time - (Date.now() - this.startStamp);
        this.timer$ = timer(delay).subscribe(() => {
            this.callHandler(this.currentNum++);
            if (this.currentNum < this.lines.length && this.playing) {
                this.playReset();
            }
        });
        // this.timer = setTimeout(()=>{
        //     this.callHandler(this.currentNum++);
        //     console.log('this.currentNum: ',this.currentNum);
        //     console.log('line.time: ',line.time);
        //     if(this.currentNum < this.lines.length && this.playing){
        //         this.playReset();
        //     }
        // },delay)
    }

    private callHandler(i: number) {
        if (i > 0) {
            this.handler.next({
                txt: this.lines[i].txt,
                txtCn: this.lines[i].txtCn,
                lineNum: i
            });
        }

    }

    togglgPlay(playing: boolean) {
        const now = Date.now();
        this.playing = playing;
        if (playing) {
            const startTime = (this.pauseTime || now) - (this.startStamp || now);
            this.play(startTime, true);
        } else {
            this.stop();
            this.pauseTime = now;
        }
    }

    stop() {
        if (this.playing) {
            this.playing = false;

        }
        // clearTimeout(this.timer);
        this.clearTimer();
    }

    seek(time: number) {
        this.play(time);
    }
}

