import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  firstName: string;

  @Column({
    nullable: true
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    nullable: true
  })
  phone: string;

  @Column({
    nullable: true
  })
  address: string;

  @Column("date", {
    nullable: true
  })
  dateOfBirth: Date;

  @Column()
  password: string;
}
