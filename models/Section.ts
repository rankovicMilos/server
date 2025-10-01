import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Section {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  label: string;

  @OneToMany(() => Question, (question) => question.section, { cascade: true })
  questions: Question[];
}
