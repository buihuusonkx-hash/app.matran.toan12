/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  FileDown,
  RefreshCw,
  PlusCircle,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixData, MatrixGroup, MatrixItem } from './types';

const INITIAL_DATA: MatrixData = {
  groups: []
};

const MATH_TEMPLATES: Record<string, { rec: string, und: string, app: string }> = {
  "Sự đồng biến, nghịch biến của hàm số": {
    rec: "- Nhận biết được tính đơn điệu của hàm số thông qua bảng biến thiên hoặc đồ thị.\n- Nhận biết được mối liên hệ giữa tính đơn điệu và dấu của đạo hàm.",
    und: "- Xác định được các khoảng đơn điệu của hàm số cho bởi công thức hoặc đạo hàm.\n- Tìm tham số m để hàm số đơn điệu trên một khoảng.",
    app: "- Giải bài toán thực tế liên quan đến tính đơn điệu.\n- Vận dụng tính đơn điệu để giải phương trình, bất phương trình."
  },
  "Cực trị của hàm số": {
    rec: "- Nhận biết được điểm cực đại, điểm cực tiểu, giá trị cực trị của hàm số thông qua bảng biến thiên hoặc đồ thị.",
    und: "- Tìm được các điểm cực trị của hàm số bằng quy tắc 1 hoặc quy tắc 2.\n- Tìm tham số m để hàm số có cực trị thỏa mãn điều kiện cho trước.",
    app: "- Giải quyết các bài toán tối ưu hóa cơ bản.\n- Bài toán cực trị chứa tham số mức độ vận dụng."
  },
  "Giá trị lớn nhất và giá trị nhỏ nhất": {
    rec: "- Nhận biết định nghĩa giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên một tập hợp.",
    und: "- Tìm được GTLN, GTNN của hàm số trên một đoạn hoặc một khoảng bằng phương pháp đạo hàm.",
    app: "- Ứng dụng GTLN, GTNN vào các bài toán thực tế (tối ưu hóa diện tích, thể tích, chi phí...).\n- Bài toán tìm GTLN, GTNN của hàm số hợp."
  },
  "Đường tiệm cận": {
    rec: "- Nhận biết được tiệm cận đứng, tiệm cận ngang của đồ thị hàm số thông qua định nghĩa hoặc giới hạn.",
    und: "- Tìm được các đường tiệm cận của đồ thị hàm số phân thức hữu tỉ đơn giản.",
    app: "- Tìm tham số m để đồ thị hàm số có số lượng đường tiệm cận thỏa mãn điều kiện.\n- Bài toán tổng hợp đồ thị và tiệm cận."
  },
  "Lũy thừa, Mũ và Lôgarit": {
    rec: "- Nhận biết các tính chất của lũy thừa với số mũ thực.\n- Nhận biết định nghĩa và các tính chất cơ bản của lôgarit.",
    und: "- Sử dụng các tính chất để rút gọn biểu thức mũ, lôgarit.\n- Tính giá trị biểu thức chứa mũ và lôgarit.",
    app: "- Bài toán thực tế liên quan đến lãi suất ngân hàng, sự tăng trưởng dân số.\n- Giải quyết các bài toán so sánh mũ, lôgarit phức hợp."
  },
  "Nguyên hàm": {
    rec: "- Nhận biết định nghĩa nguyên hàm, các tính chất của nguyên hàm.\n- Nhận biết bảng nguyên hàm của các hàm số sơ cấp.",
    und: "- Tìm nguyên hàm bằng phương pháp đổi biến số.\n- Tìm nguyên hàm bằng phương pháp từng phần.",
    app: "- Tìm nguyên hàm thỏa mãn điều kiện cho trước (f(x0) = y0).\n- Vận dụng nguyên hàm vào các bài toán chuyển động."
  },
  "Tích phân": {
    rec: "- Nhận biết định nghĩa và các tính chất của tích phân.\n- Nhận biết ý nghĩa hình học của tích phân.",
    und: "- Tính tích phân bằng phương pháp đổi biến số, từng phần.\n- Tính diện tích hình phẳng giới hạn bởi các đường đồ thị.",
    app: "- Tính thể tích khối tròn xoay.\n- Giải các bài toán thực tế sử dụng tích phân (quãng đường, vận tốc, kinh tế...)."
  },
  "Số phức": {
    rec: "- Nhận biết định nghĩa số phức, phần thực, phần ảo, số phức liên hợp, môđun.\n- Nhận biết biểu diễn hình học của số phức.",
    und: "- Thực hiện các phép tính cộng, trừ, nhân, chia số phức.\n- Giải phương trình bậc hai với hệ số thực trên tập số phức.",
    app: "- Giải các bài toán tìm tập hợp điểm biểu diễn số phức.\n- Tìm số phức có môđun lớn nhất, nhỏ nhất (cực trị số phức)."
  },
  "Khối đa diện và Thể tích": {
    rec: "- Nhận biết định nghĩa khối lăng trụ, khối chóp.\n- Nhận biết các công thức tính thể tích khối lăng trụ, khối chóp.",
    und: "- Tính thể tích khối lăng trụ, khối chóp cơ bản.\n- Tính tỉ số thể tích giữa hai khối đa diện.",
    app: "- Giải quyết các bài toán thực tế về thể tích khối đa diện.\n- Bài toán cực trị thể tích."
  },
  "Tọa độ trong không gian Oxyz": {
    rec: "- Nhận biết tọa độ điểm, vectơ, các phép toán vectơ trong không gian.\n- Nhận biết phương trình mặt cầu, phương trình mặt phẳng, đường thẳng.",
    und: "- Viết phương trình mặt phẳng, đường thẳng, mặt cầu thỏa mãn điều kiện cơ bản.\n- Tính khoảng cách, góc trong không gian.",
    app: "- Giải quyết các bài toán liên quan đến vị trí tương đối và khoảng cách phức tạp.\n- Bài toán tìm điểm cực trị trong không gian Oxyz."
  }
};

export default function App() {
  const [data, setData] = useState<MatrixData>(INITIAL_DATA);
  const [editingItem, setEditingItem] = useState<{ groupId: string, item: MatrixItem } | null>(null);
  const [editingGroup, setEditingGroup] = useState<MatrixGroup | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null); // groupId
  const [activeTab, setActiveTab] = useState<'matrix' | 'spec'>('matrix');
  const [editingRequirements, setEditingRequirements] = useState<{ groupId: string, itemId: string, reqs: { rec: string, und: string, app: string } } | null>(null);

  // Calculations
  const totals = useMemo(() => {
    let mc_rec = 0, mc_und = 0, mc_app = 0;
    let tf_rec = 0, tf_und = 0, tf_app = 0;
    let sa_und = 0, sa_app = 0, sa_adv = 0;
    let totalPeriods = 0;

    data.groups.forEach(g => {
      g.items.forEach(i => {
        mc_rec += i.mc_recognition;
        mc_und += i.mc_understanding;
        mc_app += i.mc_application;
        tf_rec += i.tf_recognition;
        tf_und += i.tf_understanding;
        tf_app += i.tf_application;
        sa_und += i.sa_understanding;
        sa_app += i.sa_application;
        sa_adv += i.sa_advanced;
        totalPeriods += i.periods;
      });
    });

    const totalQuestions = mc_rec + mc_und + mc_app + tf_rec + tf_und + tf_app + sa_und + sa_app + sa_adv;

    return {
      mc_rec, mc_und, mc_app,
      tf_rec, tf_und, tf_app,
      sa_und, sa_app, sa_adv,
      totalQuestions,
      totalPeriods
    };
  }, [data]);

  const handleUpdateItem = (groupId: string, itemId: string, field: keyof MatrixItem, value: number) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? {
        ...g,
        items: g.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
      } : g)
    }));
  };

  const handleDeleteItem = (groupId: string, itemId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setData(prev => ({
        ...prev,
        groups: prev.groups.map(g => g.id === groupId ? {
          ...g,
          items: g.items.filter(i => i.id !== itemId)
        } : g)
      }));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ chương này?')) {
      setData(prev => ({
        ...prev,
        groups: prev.groups.filter(g => g.id !== groupId)
      }));
    }
  };

  const handleAddGroup = (name: string) => {
    const newGroup: MatrixGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      items: []
    };
    setData(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
    setIsAddingGroup(false);
  };

  const handleAddItem = (groupId: string, name: string) => {
    // Find template match
    const foundKey = Object.keys(MATH_TEMPLATES).find(k =>
      name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
    );
    const match = foundKey ? MATH_TEMPLATES[foundKey] : null;

    const newItem: MatrixItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      periods: 1,
      mc_recognition: 0, mc_understanding: 0, mc_application: 0,
      tf_recognition: 0, tf_understanding: 0, tf_application: 0,
      sa_understanding: 0, sa_application: 0, sa_advanced: 0,
      req_recognition: match ? match.rec : '',
      req_understanding: match ? match.und : '',
      req_application: match ? match.app : ''
    };
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, items: [...g.items, newItem] } : g)
    }));
    setIsAddingItem(null);
  };

  const handleAutoDistribute = () => {
    if (totals.totalPeriods === 0) {
      alert('Vui lòng nhập số tiết cho các bài học!');
      return;
    }

    // Standard distribution totals (Total 22 questions)
    const distribution = {
      mc_rec: 8, mc_und: 2, mc_app: 2,
      tf_rec: 1, tf_und: 2, tf_app: 1,
      sa_und: 2, sa_app: 3, sa_adv: 1
    };

    const newData = { ...data };

    // Distribute proportionally
    newData.groups = newData.groups.map(group => ({
      ...group,
      items: group.items.map(item => {
        const ratio = item.periods / totals.totalPeriods;
        return {
          ...item,
          mc_recognition: Math.round(ratio * distribution.mc_rec),
          mc_understanding: Math.round(ratio * distribution.mc_und),
          mc_application: Math.round(ratio * distribution.mc_app),
          tf_recognition: Math.round(ratio * distribution.tf_rec),
          tf_understanding: Math.round(ratio * distribution.tf_und),
          tf_application: Math.round(ratio * distribution.tf_app),
          sa_understanding: Math.round(ratio * distribution.sa_und),
          sa_application: Math.round(ratio * distribution.sa_app),
          sa_advanced: Math.round(ratio * distribution.sa_adv)
        };
      })
    }));

    // Adjust for rounding errors (ensure totals match exactly)
    const checkAndAdjust = (field: keyof MatrixItem, target: number) => {
      let currentTotal = 0;
      newData.groups.forEach(g => g.items.forEach(i => currentTotal += (i[field] as number)));

      if (currentTotal !== target && newData.groups.length > 0) {
        // Find the item with most periods to adjust
        let bestItem: { gIdx: number, iIdx: number, periods: number } | null = null;
        newData.groups.forEach((g, gIdx) => g.items.forEach((i, iIdx) => {
          if (!bestItem || i.periods > bestItem.periods) {
            bestItem = { gIdx, iIdx, periods: i.periods };
          }
        }));

        if (bestItem) {
          const { gIdx, iIdx } = bestItem;
          const val = newData.groups[gIdx].items[iIdx][field] as number;
          (newData.groups[gIdx].items[iIdx][field] as any) = val + (target - currentTotal);
        }
      }
    };

    Object.entries(distribution).forEach(([field, target]) => {
      checkAndAdjust(field as keyof MatrixItem, target);
    });

    setData(newData);
    alert('Đã tự động phân bổ câu hỏi dựa trên số tiết!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-[#1e293b]">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-[#cbd5e1] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-bottom border-[#cbd5e1] bg-[#f1f5f9]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#0284c7] uppercase tracking-tight">
              Ma Trận Đề Kiểm Tra Môn Toán 12
            </h1>
            <p className="text-sm text-[#64748b] mt-1 italic">
              (Dành cho kỳ thi tốt nghiệp THPT và kiểm tra định kỳ)
            </p>
            <p className="text-xs text-[#94a3b8] mt-2 font-medium">
              Thiết kế bởi: <span className="text-[#0369a1]">Bùi Thị Kiên</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-6 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-[#0284c7] text-white' : 'bg-[#e2e8f0] text-[#64748b] hover:bg-[#cbd5e1]'}`}
            >
              1. Nhập liệu Ma Trận
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-6 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 ${activeTab === 'spec' ? 'bg-[#10b981] text-white' : 'bg-[#e2e8f0] text-[#64748b] hover:bg-[#cbd5e1]'}`}
            >
              2. Xem Bảng Đặc Tả
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsAddingGroup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#64748b] hover:bg-[#475569] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <PlusCircle size={18} /> Thêm Chương
            </button>
            <button
              onClick={() => {
                if (data.groups.length > 0) {
                  setIsAddingItem(data.groups[data.groups.length - 1].id);
                } else {
                  alert('Vui lòng thêm chương trước khi thêm bài!');
                  setIsAddingGroup(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus size={18} /> Thêm Bài Mới
            </button>
            <button
              onClick={handleAutoDistribute}
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <RefreshCw size={18} /> Tự Động Phân Bổ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-semibold text-sm transition-colors">
              <FileDown size={18} /> Xuất File Word
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          {activeTab === 'matrix' ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-12 font-bold">STT</th>
                  <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-16 font-bold uppercase">Số tiết</th>
                  <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 min-w-[250px] font-bold uppercase text-[11px]">Nội dung kiến thức, đơn vị kiến thức</th>
                  <th colSpan={9} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 font-bold uppercase text-[11px]">Số câu hỏi theo mức độ nhận thức</th>
                  <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-20 font-bold uppercase text-[11px]">Tổng số câu</th>
                  <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-20 font-bold uppercase text-[11px]">Tỷ lệ (%)</th>
                </tr>
                <tr>
                  <th colSpan={3} className="border border-[#cbd5e1] bg-[#f0fdf4] p-2 font-bold uppercase text-[11px]">TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN</th>
                  <th colSpan={3} className="border border-[#cbd5e1] bg-[#fefce8] p-2 font-bold uppercase text-[11px]">TRẮC NGHIỆM ĐÚNG/SAI</th>
                  <th colSpan={3} className="border border-[#cbd5e1] bg-[#fff1f2] p-2 font-bold uppercase text-[11px]">TRẢ LỜI NGẮN</th>
                </tr>
                <tr>
                  <th className="border border-[#cbd5e1] bg-[#f0fdf4] p-1 font-bold text-[#064e3b] text-[11px]">NB</th>
                  <th className="border border-[#cbd5e1] bg-[#f0fdf4] p-1 font-bold text-[#064e3b] text-[11px]">TH</th>
                  <th className="border border-[#cbd5e1] bg-[#f0fdf4] p-1 font-bold text-[#064e3b] text-[11px]">VD</th>
                  <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-bold text-[#713f12] text-[11px]">NB</th>
                  <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-bold text-[#713f12] text-[11px]">TH</th>
                  <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-bold text-[#713f12] text-[11px]">VD</th>
                  <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-bold text-[#881337] text-[11px]">NB</th>
                  <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-bold text-[#881337] text-[11px]">TH</th>
                  <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-bold text-[#881337] text-[11px]">VD,VDC</th>
                </tr>
              </thead>
              <tbody>
                {data.groups.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-20 text-center text-[#94a3b8]">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-[#f1f5f9] rounded-full text-[#cbd5e1]">
                          <PlusCircle size={48} />
                        </div>
                        <p className="text-lg font-medium text-[#64748b]">Chưa có dữ liệu ma trận</p>
                        <button
                          onClick={() => setIsAddingGroup(true)}
                          className="px-6 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          Bắt đầu bằng cách thêm chương mới
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : data.groups.map((group, gIdx) => (
                  <React.Fragment key={group.id}>
                    {/* Group Header */}
                    <tr className="bg-[#f8fafc] font-bold">
                      <td className="border border-[#cbd5e1] p-2 text-center">{gIdx + 1}</td>
                      <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">
                        {group.items.reduce((acc, i) => acc + i.periods, 0)}
                      </td>
                      <td className="border border-[#cbd5e1] p-2 text-left uppercase text-[#0369a1]">
                        {group.name}
                      </td>
                      <td colSpan={9} className="border border-[#cbd5e1] p-2"></td>
                      <td className="border border-[#cbd5e1] p-2 text-center">
                        {group.items.reduce((acc, i) => acc + i.mc_recognition + i.mc_understanding + i.mc_application + i.tf_recognition + i.tf_understanding + i.tf_application + i.sa_understanding + i.sa_application + i.sa_advanced, 0)}
                      </td>
                      <td className="border border-[#cbd5e1] p-2 text-center">
                        {((group.items.reduce((acc, i) => acc + i.mc_recognition + i.mc_understanding + i.mc_application + i.tf_recognition + i.tf_understanding + i.tf_application + i.sa_understanding + i.sa_application + i.sa_advanced, 0) / (totals.totalQuestions || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {/* Items */}
                    {group.items.map((item, iIdx) => {
                      const itemTotal = item.mc_recognition + item.mc_understanding + item.mc_application + item.tf_recognition + item.tf_understanding + item.tf_application + item.sa_understanding + item.sa_application + item.sa_advanced;
                      return (
                        <tr key={item.id} className="hover:bg-[#f1f5f9] transition-colors">
                          <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">{gIdx + 1}.{iIdx + 1}</td>
                          <td className="border border-[#cbd5e1] p-1 bg-white">
                            <input
                              type="number"
                              min="1"
                              value={item.periods}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'periods', parseInt(e.target.value) || 1)}
                              className="w-full bg-transparent text-center focus:outline-none font-medium"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-2 text-left pl-6 font-medium group relative">
                            <div className="flex items-center justify-between">
                              <span>{item.name}</span>
                              <button
                                onClick={() => setEditingRequirements({
                                  groupId: group.id,
                                  itemId: item.id,
                                  reqs: {
                                    rec: item.req_recognition,
                                    und: item.req_understanding,
                                    app: item.req_application
                                  }
                                })}
                                className="p-1 text-[#0284c7] hover:bg-[#e0f2fe] rounded"
                                title="Chỉnh sửa đặc tả"
                              >
                                <FileText size={14} />
                              </button>
                            </div>
                          </td>
                          {/* MC */}
                          <td className="border border-[#cbd5e1] p-1 bg-[#f0fdf4]">
                            <input
                              type="number"
                              min="0"
                              value={item.mc_recognition}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'mc_recognition', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#f0fdf4]">
                            <input
                              type="number"
                              min="0"
                              value={item.mc_understanding}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'mc_understanding', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#f0fdf4]">
                            <input
                              type="number"
                              min="0"
                              value={item.mc_application}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'mc_application', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          {/* TF */}
                          <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                            <input
                              type="number"
                              min="0"
                              value={item.tf_recognition}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_recognition', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                            <input
                              type="number"
                              min="0"
                              value={item.tf_understanding}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_understanding', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                            <input
                              type="number"
                              min="0"
                              value={item.tf_application}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_application', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          {/* SA */}
                          <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                            <input
                              type="number"
                              min="0"
                              value={item.sa_understanding}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_understanding', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                            <input
                              type="number"
                              min="0"
                              value={item.sa_application}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_application', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                            <input
                              type="number"
                              min="0"
                              value={item.sa_advanced}
                              onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_advanced', parseInt(e.target.value) || 0)}
                              className="w-full bg-transparent text-center focus:outline-none font-semibold"
                            />
                          </td>
                          <td className="border border-[#cbd5e1] p-2 text-center font-bold text-[#0369a1]">
                            {itemTotal}
                          </td>
                          <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">
                            {((itemTotal / (totals.totalQuestions || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#f1f5f9] font-bold text-[#0f172a]">
                  <td className="border border-[#cbd5e1] p-2"></td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#e0f2fe]">{totals.totalPeriods}</td>
                  <td className="border border-[#cbd5e1] p-3 text-right uppercase">Tổng cộng</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#dcfce7]">{totals.mc_rec}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#dcfce7]">{totals.mc_und}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#dcfce7]">{totals.mc_app}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_rec}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_und}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_app}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_und}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_app}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_adv}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center text-[#0284c7] text-lg">{totals.totalQuestions}</td>
                  <td className="border border-[#cbd5e1] p-2 text-center">100%</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <table className="w-full border-collapse text-sm border border-gray-500">
              <thead className="bg-[#e0f2fe] text-center font-bold">
                <tr>
                  <th className="border border-gray-500 p-2" rowSpan={3}>TT</th>
                  <th className="border border-gray-500 p-2" rowSpan={3}>Chương / Chủ đề</th>
                  <th className="border border-gray-500 p-2" rowSpan={3}>Nội dung</th>
                  <th className="border border-gray-500 p-2" rowSpan={3}>Mức độ</th>
                  <th className="border border-gray-500 p-2 w-[350px]" rowSpan={3}>Yêu cầu cần đạt (Kết quả học tập cần đạt)</th>
                  <th className="border border-gray-500 p-2" colSpan={9}>Số câu TNKQ</th>
                </tr>
                <tr>
                  <th className="border border-gray-500 p-2" colSpan={3}>Nhiều lựa chọn (Câu)</th>
                  <th className="border border-gray-500 p-2" colSpan={3}>Đúng – Sai (Số lệnh)</th>
                  <th className="border border-gray-500 p-2" colSpan={3}>Trả lời ngắn (Câu)</th>
                </tr>
                <tr>
                  <th className="border border-gray-500 p-1 bg-[#f0fdf4]">NB</th>
                  <th className="border border-gray-500 p-1 bg-[#f0fdf4]">TH</th>
                  <th className="border border-gray-500 p-1 bg-[#f0fdf4]">VD</th>
                  <th className="border border-gray-500 p-1 bg-[#fefce8]">NB</th>
                  <th className="border border-gray-500 p-1 bg-[#fefce8]">TH</th>
                  <th className="border border-gray-500 p-1 bg-[#fefce8]">VD</th>
                  <th className="border border-gray-500 p-1 bg-[#fff1f2]">NB</th>
                  <th className="border border-gray-500 p-1 bg-[#fff1f2]">TH</th>
                  <th className="border border-gray-500 p-1 bg-[#fff1f2]">VD</th>
                </tr>
              </thead>
              <tbody>
                {data.groups.map((group, gIdx) => (
                  <React.Fragment key={group.id}>
                    {group.items.map((item, iIdx) => {
                      const totalRowsForItem = 3;
                      return (
                        <React.Fragment key={item.id}>
                          {/* Row for Recognition */}
                          <tr>
                            {iIdx === 0 && (
                              <td rowSpan={group.items.length * 3} className="border border-gray-500 p-2 text-center font-bold">
                                {gIdx + 1}
                              </td>
                            )}
                            {iIdx === 0 && (
                              <td rowSpan={group.items.length * 3} className="border border-gray-500 p-2 font-bold bg-[#f8fafc]">
                                {group.name}
                              </td>
                            )}
                            <td rowSpan={3} className="border border-gray-500 p-2 font-medium">
                              {item.name}
                            </td>
                            <td className="border border-gray-500 p-2 italic text-[#064e3b] bg-green-50/30">Nhận biết</td>
                            <td className="border border-gray-500 p-2 whitespace-pre-line text-xs">{item.req_recognition || '-'}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4] font-bold text-blue-600">{item.mc_recognition || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8] font-bold text-blue-600">{item.tf_recognition || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                          </tr>
                          {/* Row for Understanding */}
                          <tr>
                            <td className="border border-gray-500 p-2 italic text-[#713f12] bg-yellow-50/30">Thông hiểu</td>
                            <td className="border border-gray-500 p-2 whitespace-pre-line text-xs">{item.req_understanding || '-'}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4] font-bold text-blue-600">{item.mc_understanding || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8] font-bold text-blue-600">{item.tf_understanding || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2] font-bold text-blue-600">{item.sa_understanding || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                          </tr>
                          {/* Row for Application */}
                          <tr>
                            <td className="border border-gray-500 p-2 italic text-[#881337] bg-red-50/30">Vận dụng</td>
                            <td className="border border-gray-500 p-2 whitespace-pre-line text-xs">
                              {item.req_application || '-'}
                            </td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#f0fdf4] font-bold text-blue-600">{item.mc_application || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fefce8] font-bold text-blue-600">{item.tf_application || ''}</td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2]"></td>
                            <td className="border border-gray-500 p-2 text-center bg-[#fff1f2] font-bold text-blue-600">{(item.sa_application + item.sa_advanced) || ''}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Info */}
        <div className="p-6 bg-[#f8fafc] border-t border-[#cbd5e1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm text-center">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center justify-center gap-2 uppercase text-xs">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                Phần I: Trắc nghiệm nhiều phương án
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.mc_rec + totals.mc_und + totals.mc_app}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">{((totals.mc_rec + totals.mc_und + totals.mc_app) * 0.25).toFixed(2)}</span></p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm text-center">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center justify-center gap-2 uppercase text-xs">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                Phần II: Trắc nghiệm đúng/sai
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.tf_rec + totals.tf_und + totals.tf_app}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">4.00</span></p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm text-center">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center justify-center gap-2 uppercase text-xs">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                Phần III: Trả lời ngắn
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.sa_und + totals.sa_app + totals.sa_adv}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">{((totals.sa_und + totals.sa_app + totals.sa_adv) * 0.5).toFixed(2)}</span></p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-[#cbd5e1] text-center">
          <p className="text-[#64748b] text-sm">
            App được thiết kế bởi <span className="text-[#0284c7] font-bold">Bùi Thị Kiên</span>
          </p>
        </div>
      </div>




      {/* Modals */}
      <AnimatePresence>
        {(isAddingGroup || editingGroup) && (
          <Modal
            title={editingGroup ? "Sửa tên chương" : "Thêm chương mới"}
            onClose={() => { setIsAddingGroup(false); setEditingGroup(null); }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              if (editingGroup) {
                setData(prev => ({
                  ...prev,
                  groups: prev.groups.map(g => g.id === editingGroup.id ? { ...g, name } : g)
                }));
                setEditingGroup(null);
              } else {
                handleAddGroup(name);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Tên chương</label>
                <input
                  name="name"
                  defaultValue={editingGroup?.name || ''}
                  autoFocus
                  className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:border-transparent outline-none"
                  placeholder="Nhập tên chương..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingGroup(false); setEditingGroup(null); }}
                  className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </Modal>
        )}

        {(isAddingItem || editingItem) && (
          <Modal
            title={editingItem ? "Sửa tên mục" : "Thêm đơn vị kiến thức"}
            onClose={() => { setIsAddingItem(null); setEditingItem(null); }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              if (editingItem) {
                // Find template if it's a new name and requirements are empty
                const foundKey = Object.keys(MATH_TEMPLATES).find(k =>
                  name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
                );
                const match = foundKey ? MATH_TEMPLATES[foundKey] : null;

                setData(prev => ({
                  ...prev,
                  groups: prev.groups.map(g => g.id === editingItem.groupId ? {
                    ...g,
                    items: g.items.map(i => i.id === editingItem.item.id ? {
                      ...i,
                      name,
                      req_recognition: i.req_recognition || (match ? match.rec : ''),
                      req_understanding: i.req_understanding || (match ? match.und : ''),
                      req_application: i.req_application || (match ? match.app : '')
                    } : i)
                  } : g)
                }));
                setEditingItem(null);
              } else if (isAddingItem) {
                handleAddItem(isAddingItem, name);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Tên đơn vị kiến thức</label>
                <input
                  name="name"
                  defaultValue={editingItem?.item.name || ''}
                  autoFocus
                  className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:border-transparent outline-none"
                  placeholder="Nhập tên đơn vị kiến thức..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingItem(null); setEditingItem(null); }}
                  className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </Modal>
        )}

        {editingRequirements && (
          <Modal
            title="Sửa Đặc Tả (Yêu cầu cần đạt)"
            onClose={() => setEditingRequirements(null)}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const rec = (e.currentTarget.elements.namedItem('req_recognition') as HTMLTextAreaElement).value;
              const und = (e.currentTarget.elements.namedItem('req_understanding') as HTMLTextAreaElement).value;
              const app = (e.currentTarget.elements.namedItem('req_application') as HTMLTextAreaElement).value;

              setData(prev => ({
                ...prev,
                groups: prev.groups.map(g => g.id === editingRequirements.groupId ? {
                  ...g,
                  items: g.items.map(i => i.id === editingRequirements.itemId ? {
                    ...i,
                    req_recognition: rec,
                    req_understanding: und,
                    req_application: app
                  } : i)
                } : g)
              }));
              setEditingRequirements(null);
            }}>
              <div className="mb-4 flex justify-between items-center bg-blue-50 p-2 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-700 font-medium italic">
                  Gợi ý: Nhấn "Tự động điền" để lấy mẫu dựa trên tên bài học.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    // Try to match the item name
                    const itemName = data.groups.flatMap(g => g.items).find(i => i.id === editingRequirements.itemId)?.name || '';
                    let match = MATH_TEMPLATES[itemName];

                    if (!match) {
                      // Try fuzzy match
                      const foundKey = Object.keys(MATH_TEMPLATES).find(k => itemName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(itemName.toLowerCase()));
                      if (foundKey) match = MATH_TEMPLATES[foundKey];
                    }

                    if (match) {
                      const form = document.querySelector('form');
                      if (form) {
                        (form.elements.namedItem('req_recognition') as HTMLTextAreaElement).value = match.rec;
                        (form.elements.namedItem('req_understanding') as HTMLTextAreaElement).value = match.und;
                        (form.elements.namedItem('req_application') as HTMLTextAreaElement).value = match.app;
                      }
                    } else {
                      alert('Không tìm thấy mẫu phù hợp cho bài này. Bạn có thể tự viết hoặc thử tên khác.');
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-bold transition-colors"
                >
                  Tự động điền đặc tả
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-green-700 mb-1">Cấp độ: Nhận biết</label>
                  <textarea
                    name="req_recognition"
                    defaultValue={editingRequirements.reqs.rec}
                    className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none text-sm"
                    rows={4}
                    placeholder="Nhập yêu cầu cần đạt cho mức độ nhận biết..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-yellow-700 mb-1">Cấp độ: Thông hiểu</label>
                  <textarea
                    name="req_understanding"
                    defaultValue={editingRequirements.reqs.und}
                    className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#f59e0b] outline-none text-sm"
                    rows={4}
                    placeholder="Nhập yêu cầu cần đạt cho mức độ thông hiểu..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-1">Cấp độ: Vận dụng</label>
                  <textarea
                    name="req_application"
                    defaultValue={editingRequirements.reqs.app}
                    className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#ef4444] outline-none text-sm"
                    rows={4}
                    placeholder="Nhập yêu cầu cần đạt cho mức độ vận dụng..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingRequirements(null)}
                  className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
                >
                  Lưu đặc tả
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#cbd5e1] bg-[#f8fafc]">
          <h2 className="font-bold text-[#0f172a]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
