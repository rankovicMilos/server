import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column()
  value!: string;

  @Column()
  label!: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question!: Question;
}
