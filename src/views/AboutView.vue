<template>
  <div class="about-page">
    <section class="panel">
      <h1>关于本工具</h1>
      <p>项目定位：广西职教高考志愿辅助模拟工具，不是官方志愿填报系统。</p>
      <p class="powered">Powered By Waiting</p>
    </section>

    <section class="panel">
      <h2>数据口径说明</h2>
      <ul>
        <li>当前版本主做电子信息大类、对口技能类录取方式。</li>
        <li>推荐最小单位为“学校 + 专业”，同校不同专业分别计算。</li>
        <li>缺失数据保持为空并展示“暂无公开数据”，不做臆测填充。</li>
      </ul>
    </section>

    <section class="panel">
      <h2>排名估算边界</h2>
      <ul>
        <li>页面展示的是“参考位次（低可信）”，仅基于预设宽区间规则。</li>
        <li>不输出精确名次，不替代官方一分一档。</li>
        <li>该模块仅作辅助，不作为核心决策依据。</li>
      </ul>
    </section>

    <section class="panel">
      <h2>非官方声明</h2>
      <p>本工具仅供模拟参考，最终请以广西招生考试院及院校官方公布信息为准。</p>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  display: grid;
  gap: 13px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

h1,
h2 {
  margin: 0;
  font-size: 1.01rem;
  letter-spacing: 0.01em;
}

p,
li {
  margin: 8px 0 0;
  font-size: 0.84rem;
  line-height: 1.62;
  color: var(--color-subtle);
}

ul {
  margin: 0;
  padding-left: 16px;
}

.powered {
  display: inline-flex;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: var(--color-surface-soft);
  font-size: 0.73rem;
  letter-spacing: 0.03em;
}
</style>
