import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Section } from "./Section";
import { Answer } from "./Answer";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column()
  type!: "boolean" | "single" | "multi";

  @Column()
  label!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Section, (section) => section.questions)
  section!: Section;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers!: Answer[];
}
