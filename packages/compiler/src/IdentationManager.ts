const TWO_SPACES = "  ";

export class IdentationManager {
  private level = 0;

  padding = () => TWO_SPACES.repeat(this.level);

  increase = () => ++this.level;

  decrease = () => --this.level;
}