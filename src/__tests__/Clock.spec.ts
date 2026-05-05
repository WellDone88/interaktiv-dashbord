import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Clock from '../components/Clock.vue'

const fixedDate = new Date(2026, 4, 5, 12, 34, 56)

describe('Clock.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderer lokal tid og dato', async () => {
    const wrapper = mount(Clock)

    expect(wrapper.text()).toContain(fixedDate.toLocaleTimeString())
    expect(wrapper.text()).toContain(fixedDate.toLocaleDateString())

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()

    const nextDate = new Date(fixedDate.getTime() + 1000)
    expect(wrapper.text()).toContain(nextDate.toLocaleTimeString())
  })
})
