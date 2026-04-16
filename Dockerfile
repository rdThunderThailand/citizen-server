# ใช้งาน official image ของ Bun เป็นฐาน
# alpine มีขนาดเล็กมากและปลอดภัยต่อ production
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# --------- Stage 1: ติดตั้ง dependencies ---------
FROM base AS install
# สร้างโฟลเดอร์ temp เพื่อรัน install โดยให้ cache ดึงไปใช้ได้
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# เอาเฉพาะ production dependencies เพื่อให้ Docker image เล็กสุดๆ
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# --------- Stage 2: เตรียมโค้ด ---------
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# (ถ้ามี build step เข้ามาในอนาคต เช่น compile TS เป็น JS ก็ทำตรงนี้)
# ตัวอย่าง: ENV NODE_ENV=production
# RUN bun run build

# --------- Stage 3: นำไปรันจริง (Production Image) ---------
FROM base AS release

# แนะนำให้รันในฐานะ user `bun` ซึ่งไม่ใช่ root (ปลอดภัยกว่า)
USER bun

# คัดลอก node_modules เฉพาะของ production
COPY --from=install /temp/prod/node_modules node_modules

# คัดลอก source code ที่เราเตรียมไว้แล้ว (จาก prerelease)
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .

# รับ parameter ที่อาจถูกส่งเข้ามา
EXPOSE 3001/tcp
ENV PORT=3001
ENV NODE_ENV=production

# คำสั่งตอน Start Container
ENTRYPOINT [ "bun", "run", "start" ]
