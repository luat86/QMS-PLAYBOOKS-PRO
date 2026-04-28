import { PlaybookData } from './types';

export const PLAYBOOK_DATA: PlaybookData = {
  groups: [
    {
      id: 'G1',
      title: 'Giai đoạn 1: Chuẩn bị & Thiết lập (Pre-Construction)',
      description: 'Mục tiêu: Xây dựng "Bộ não" cho dự án.',
      sections: [
        {
          id: 'S1.1',
          title: 'Mục 1.1: Quản lý Quy trình & Biện pháp',
          tasks: [
            {
              id: 'T1.1.1',
              title: 'Lập Lưu đồ quy trình (Flowcharts)',
              role: 'Quản lý Dự án / Kỹ sư Trưởng',
              description: 'Phân định luồng công việc giữa các bên (RFI, phê duyệt vật liệu, xử lý NC).',
              input: ['Hợp đồng', 'Quy trình ISO 9001:2015'],
              tool: 'LucidChart / Visio',
              output: 'Bộ Lưu đồ quy trình dự án',
              checklist: ['Luồng RFI', 'Phê duyệt vật liệu', 'Xử lý NCR']
            },
            {
              id: 'T1.1.2',
              title: 'Phê duyệt Biện pháp thi công (Method Statements)',
              role: 'Kỹ sư Kỹ thuật',
              description: 'Soạn thảo và thẩm định phương án kỹ thuật cho các hạng mục chính.',
              input: ['Bản vẽ thiết kế', 'Tiêu chuẩn kỹ thuật'],
              tool: 'Word / PDF',
              output: 'Biện pháp thi công đã phê duyệt'
            },
            {
              id: 'T1.1.3',
              title: 'Thiết lập Kế hoạch ITP',
              role: 'Kỹ sư QA/QC',
              description: 'Danh mục các điểm dừng kỹ thuật và tần suất lấy mẫu.',
              input: ['Tiêu chuẩn dự án', 'Quy định Nhà nước'],
              tool: 'Excel / Spreadsheet',
              output: 'Kế hoạch ITP hoàn chỉnh'
            }
          ]
        },
        {
          id: 'S1.2',
          title: 'Mục 1.2: Quản lý Nguồn lực (Resources)',
          tasks: [
            {
              id: 'T1.2.1',
              title: 'Audit năng lực nhà thầu/nhân sự',
              role: 'Trưởng ban Kiểm soát',
              description: 'Kiểm tra chứng chỉ, kinh nghiệm.',
              input: ['Hồ sơ năng lực', 'Chứng chỉ hành nghề'],
              tool: 'Checklist năng lực',
              output: 'Báo cáo đánh giá năng lực'
            },
            {
              id: 'T1.2.2',
              title: 'Kiểm soát thiết bị đo lường',
              role: 'Thủ kho / Kỹ sư Thiết bị',
              description: 'Lập danh mục và theo dõi hạn hiệu chuẩn (ISO 7.1.5).',
              input: ['Danh mục thiết bị', 'Tem hiệu chuẩn'],
              tool: 'Sổ theo dõi hiệu chuẩn',
              output: 'Danh sách thiết bị đạt chuẩn'
            }
          ]
        }
      ]
    },
    {
      id: 'G2',
      title: 'Giai đoạn 2: Kiểm soát Đầu vào (Input Control)',
      description: 'Mục tiêu: Đảm bảo "Nguyên liệu sạch".',
      sections: [
        {
          id: 'S2.1',
          title: 'Mục 2.1: Phê duyệt vật liệu',
          tasks: [
            {
              id: 'T2.1.1',
              title: 'Trình mẫu (Material Submission)',
              role: 'Kỹ sư Vật tư',
              description: 'Hồ sơ CO/CQ và mẫu thực tế.',
              input: ['CO/CQ', 'Mẫu vật liệu'],
              tool: 'Form Trình mẫu',
              output: 'Vật liệu được chấp thuận'
            },
            {
              id: 'T2.1.2',
              title: 'Kiểm tra tại hiện trường',
              role: 'Kỹ sư QC hiện trường',
              description: 'Sử dụng Checklist vật liệu đầu vào để đối soát khi hàng cập bến.',
              input: ['Lệnh giao hàng', 'Mẫu đối chứng'],
              tool: 'Checklist vật liệu đầu vào',
              output: 'Biên bản kiểm tra vật tư'
            }
          ]
        },
        {
          id: 'S2.2',
          title: 'Mục 2.2: Thí nghiệm & Kiểm định',
          tasks: [
            {
              id: 'T2.2.1',
              title: 'Lấy mẫu thí nghiệm',
              role: 'Kỹ sư QC / TVGS',
              description: 'Lưu đồ lấy mẫu, niêm phong và gửi Láp.',
              input: ['Lô hàng', 'Quy định lấy mẫu'],
              tool: 'Lưu đồ lấy mẫu',
              output: 'Mẫu đã niêm phong & Phiếu yêu cầu thí nghiệm'
            }
          ]
        }
      ]
    },
    {
      id: 'G3',
      title: 'Giai đoạn 3: Kiểm soát Thi công (Process Control)',
      description: 'Mục tiêu: Thực thi đúng Biện pháp & Checklist.',
      sections: [
        {
          id: 'S3.1',
          title: 'Mục 3.1: Triển khai thi công (Hạng mục X)',
          tasks: [
            {
              id: 'T3.1.1',
              title: 'Họp triển khai (Toolbox Meeting)',
              role: 'Kỹ sư hiện trường',
              description: 'Phổ biến Biện pháp thi công và Lưu đồ quy trình cho đội ngũ trực tiếp.',
              input: ['Biện pháp thi công', 'An toàn lao động'],
              tool: 'Meeting Log',
              output: 'Biên bản họp Toolbox'
            },
            {
              id: 'T3.1.2',
              title: 'Kiểm tra cốt thép dầm/sàn',
              role: 'Kỹ sư hiện trường Nhà thầu',
              constraint: 'Phải xong trước khi mời TVGS tối thiểu 2 giờ. Căn cứ theo bản vẽ Shopdrawing Rev.02.',
              description: 'Kỹ sư nhà thầu sử dụng Checklist kỹ thuật để tự soát lỗi.',
              input: ['Biện pháp thi công thép', 'Bản vẽ chi tiết'],
              tool: 'Checklist cốt thép',
              output: 'Phiếu tự kiểm tra nội bộ đã ký + Ảnh chụp hiện trạng',
              checklist: ['Chủng loại thép', 'Mật độ / Khoảng cách', 'Con kê', 'Mối nối']
            },
            {
              id: 'T3.1.3',
              title: 'Nghiệm thu chính thức (RFI)',
              role: 'Kỹ sư QC / TVGS / CĐT',
              description: 'Theo Lưu đồ phối hợp với TVGS/Chủ đầu tư.',
              input: ['Phiếu tự nghiệm thu', 'Hồ sơ bản vẽ'],
              tool: 'RFI Flowchart',
              output: 'Biên bản nghiệm thu công việc'
            }
          ]
        },
        {
          id: 'S3.2',
          title: 'Mục 3.2: Quản lý Sự không phù hợp (NC Control)',
          tasks: [
            {
              id: 'T3.2.1',
              title: 'Ghi nhận lỗi (NCR)',
              role: 'TVGS / Kỹ sư QC',
              description: 'Chụp ảnh, lập phiếu NC theo quy trình ISO.',
              input: ['Ảnh chụp hiện trường', 'Tiêu chuẩn kỹ thuật'],
              tool: 'NCR Template',
              output: 'Phiếu NCR đã phát hành'
            }
          ]
        }
      ]
    },
    {
      id: 'G4',
      title: 'Giai đoạn 4: Kết thúc & Bàn giao (Closing & Handover)',
      description: 'Mục tiêu: Đóng gói hồ sơ pháp lý.',
      sections: [
        {
          id: 'S4.1',
          title: 'Mục 4.1: Hoàn thiện hồ sơ QLCL',
          tasks: [
            {
              id: 'T4.1.1',
              title: 'Tập hợp Bản vẽ hoàn công',
              role: 'Kỹ sư hoàn công',
              description: 'Đối chiếu thực tế thi công với Shopdrawing.',
              input: ['Shopdrawing', 'Hiện trạng thi công'],
              tool: 'AutoCAD / PDF',
              output: 'Bản vẽ hoàn công'
            },
            {
              id: 'T4.1.2',
              title: 'Hệ thống hóa Nhật ký công trình',
              role: 'Thư ký dự án',
              description: 'Đảm bảo tính liên tục và khớp nối với các biên bản nghiệm thu.',
              input: ['Nhật ký hàng ngày', 'Biên bản nghiệm thu'],
              tool: 'Dự án Nhật ký',
              output: 'Hồ sơ nhật ký hoàn chỉnh'
            }
          ]
        },
        {
          id: 'S4.2',
          title: 'Mục 4.2: Nghiệm thu bàn giao',
          tasks: [
            {
              id: 'T4.2.1',
              title: 'Tổng kiểm tra (Final Walkthrough)',
              role: 'Ban nghiệm thu',
              description: 'Sử dụng Checklist bàn giao để rà soát lỗi tồn tại (Punchlist).',
              input: ['Hồ sơ hoàn công', 'Tiêu chuẩn bàn giao'],
              tool: 'Checklist bàn giao',
              output: 'Danh sách Punchlist / Biên bản bàn giao'
            },
            {
              id: 'T4.2.2',
              title: 'Chuyển giao hồ sơ O&M',
              role: 'Quản lý Vận hành',
              description: 'Hướng dẫn vận hành và bảo trì.',
              input: ['Hướng dẫn thiết bị', 'Quy trình bảo trì'],
              tool: 'Sổ tay O&M',
              output: 'Biên bản chuyển giao O&M'
            }
          ]
        }
      ]
    }
  ]
};
