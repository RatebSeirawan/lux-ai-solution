import winston from "winston";
import { Unit } from "./lux";

export default class Logger {
  public turn: number;
  public container: winston.Container;

  public constructor(turn: number = -1) {
    this.turn = turn;
    this.container = new winston.Container();

    this.container.add("general", {
      format: winston.format.json({ space: 2 }),
      transports: [
        new winston.transports.File({
          filename: `logs/general.log`,
        }),
      ],
    });
  }

  public unit(u: Unit, action: string) {
    const sid = this._sid("unit", u.id);

    this._check(sid, "units");

    this.container.get(sid).info({
      action: action,
      unit: {
        team: u.team,
        cargo: u.cargo,
        id: u.id,
        cooldown: u.cooldown,
        pos: [u.pos.x, u.pos.y],
      },
      turn: this.turn,
    });
  }

  public setTurn(turn: number) {
    this.turn = turn;
  }

  public log(message: any) {
    this.container.get("general").info(message);
  }

  private _sid(prefix: string, id: string) {
    return `${prefix}-${id}`;
  }

  private _check(sid: string, file: string) {
    if (!this.container.has(sid)) {
      this.container.add(sid, {
        format: winston.format.json({ space: 2 }),
        transports: [
          new winston.transports.File({
            filename: `logs/${file}/${sid.split("-")[1]}.log`,
          }),
        ],
      });
    }
  }
}

const logger = new Logger();

export { logger };
