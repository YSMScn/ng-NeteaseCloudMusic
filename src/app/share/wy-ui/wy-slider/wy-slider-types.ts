import { Observable } from 'rxjs'

export type wySliderStyle = {
    width?:string | null;
    height?:string | null;
    left?:string | null;
    bottom?:string | null;

}

export type SliderEventObserverConfig = {
    start:string;
    move:string;
    end:string;
    filters: (e: Event) => boolean;
    pluckKey:string[];
    startPlucked$?:Observable<number>;
    moveResolved$?:Observable<number>;
    end$?:Observable<Event>;
}