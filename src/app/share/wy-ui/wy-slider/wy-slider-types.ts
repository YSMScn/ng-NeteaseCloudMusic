import { Observable } from 'rxjs';

export interface wySliderStyle {
    width?: string | null;
    height?: string | null;
    left?: string | null;
    bottom?: string | null;

}

export interface SliderEventObserverConfig {
    start: string;
    move: string;
    end: string;
    filters: (e: Event) => boolean;
    pluckKey: string[];
    startPlucked$?: Observable<number>;
    moveResolved$?: Observable<number>;
    end$?: Observable<Event>;
}

export type SliderValue = number | null;
