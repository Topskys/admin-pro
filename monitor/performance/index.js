import fetch from './fetch';
import xhr from './xhr';
import observerEntries from './observerEntries';
import observerFCP from './observerFCP';
import observerLCP from './observerLCP';
import observerLoad from './observerLoad';
import observerPaint from './observerPaint';

export default function performance() {
  observerEntries();
  observerFCP();
  observerLCP();
  observerLoad();
  observerPaint();
  fetch();
  xhr();
}
