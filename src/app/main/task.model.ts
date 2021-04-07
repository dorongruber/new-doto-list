import { ImageSnippet } from './imagesnippet.model';

export class Task {

  constructor(
    public title: string,
    public content: string,
    public date: Date,
    public color: string,
    public id: number,
    public img: ImageSnippet
  ) {}
}
