import { DataSource } from 'typeorm';
import { User } from './users/entity/user.entity';
import { UserInfo } from './users/entity/userinfo.entity';
import { RadCheckModel } from './users/entity/radcheck.entity';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, UserInfo, RadCheckModel],
    synchronize: true,
});

async function seed() {
    await dataSource.initialize();

    const userRepository = dataSource.getRepository(User);
    const userInfoRepository = dataSource.getRepository(UserInfo);
    const radCheckRepository = dataSource.getRepository(RadCheckModel);

    const users = [];
    const userInfos = [];
    const radChecks = [];

    for (let i = 1; i <= 5; i++) {
        const password = await bcrypt.hash(`password${i}`, 10);
        
        users.push(
            { username: `admin${i}`, password, role: 'admin' },
            { username: `manager${i}`, password, role: 'manager' }
        );

        userInfos.push(
            { username: `admin${i}`, homephone: `071234567${i}`, workphone: null, mobilephone: null },
            { username: `manager${i}`, homephone: null, workphone: `072345678${i}`, mobilephone: null }
        );

        radChecks.push(
            { username: `071234567${i}`, value: `password${i}`, expired: false, expiryDate: new Date() },
            { username: `072345678${i}`, value: `password${i + 5}`, expired: false, expiryDate: new Date() }
        );
    }

    await userRepository.save(users);
    await userInfoRepository.save(userInfos);
    await radCheckRepository.save(radChecks);

    console.log('Seeding complete!');
    await dataSource.destroy();
}

seed().catch((err) => console.error('Seeding error:', err));