from scapy.all import *
from datetime import datetime

def main():
    print "Reading pcap file %s"%sys.argv[1]
    myreader = PcapReader(sys.argv[1])
    for pkt in myreader:
		try:
		    extra = pkt.notdecoded
		except:
		    extra = None
		if extra!=None:
			# print " ".join(hex(ord(n)) for n in extra)
			signal_strength = (256-ord(extra[14:15]))
			signal_strength = signal_strength - 256 if signal_strength > 127 else signal_strength
			signal_strength = -signal_strength
		else:
		    signal_strength = -100
		    print "No signal strength found"
		print "[%d] MAC: %s RSSi: %d"%(pkt.time, pkt.addr1, signal_strength)

if __name__=="__main__":
    main()
