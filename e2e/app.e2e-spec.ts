import { Frontend1Page } from './app.po';

describe('frontend1 App', function() {
  let page: Frontend1Page;

  beforeEach(() => {
    page = new Frontend1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
